package http

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type TaskHandler struct {
	taskService interfaces.TaskService
}

// NewTaskHandler creates a new task handler
func NewTaskHandler(taskService interfaces.TaskService) *TaskHandler {
	return &TaskHandler{
		taskService: taskService,
	}
}

// CreateTaskRequest represents the request body for creating a task
type CreateTaskRequest struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Priority    string  `json:"priority"`
	Domain      string  `json:"domain"`
	Deadline    *string `json:"deadline"` // Optional, ISO 8601 format
}

// UpdateTaskRequest represents the request body for updating a task
type UpdateTaskRequest struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Priority    string  `json:"priority"`
	Domain      string  `json:"domain"`
	Deadline    *string `json:"deadline"` // Optional, ISO 8601 format
}

// CreateTask handles POST /api/tasks
func (h *TaskHandler) CreateTask(c *fiber.Ctx) error {
	// Get user ID from context (set by auth middleware)
	userID := c.Locals("userID").(uuid.UUID)

	// Parse request body
	var req CreateTaskRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate required fields
	if req.Title == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Title is required",
		})
	}

	if req.Domain == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Domain is required",
		})
	}

	// Create task
	task, err := h.taskService.CreateTask(
		userID,
		req.Title,
		req.Description,
		req.Priority,
		req.Domain,
		req.Deadline,
	)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Task created successfully",
		"task":    task,
	})
}

// GetTasks handles GET /api/tasks
func (h *TaskHandler) GetTasks(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Get query parameters
	domain := c.Query("domain")
	status := c.Query("status")
	timeFilter := c.Query("time_filter")

	// Get tasks
	var tasks []*entities.Task
	var err error

	if domain != "" || status != "" || timeFilter != "" {
		tasks, err = h.taskService.GetUserTasksWithFilters(userID, domain, status, timeFilter)
	} else {
		tasks, err = h.taskService.GetUserTasks(userID)
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve tasks",
		})
	}

	return c.JSON(fiber.Map{
		"tasks": tasks,
	})
}

// GetTask handles GET /api/tasks/:id
func (h *TaskHandler) GetTask(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse task ID
	taskID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}

	// Get task
	task, err := h.taskService.GetTask(taskID, userID)
	if err != nil {
		if err.Error() == "unauthorized: task does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Task not found",
		})
	}

	return c.JSON(fiber.Map{
		"task": task,
	})
}

// UpdateTask handles PUT /api/tasks/:id
func (h *TaskHandler) UpdateTask(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse task ID
	taskID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}

	// Parse request body
	var req UpdateTaskRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Update task
	task, err := h.taskService.UpdateTask(
		taskID,
		userID,
		req.Title,
		req.Description,
		req.Priority,
		req.Domain,
		req.Deadline,
	)
	if err != nil {
		if err.Error() == "unauthorized: task does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Task updated successfully",
		"task":    task,
	})
}

// ToggleTaskStatus handles PATCH /api/tasks/:id/status
func (h *TaskHandler) ToggleTaskStatus(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse task ID
	taskID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}

	// Toggle status
	task, err := h.taskService.ToggleTaskStatus(taskID, userID)
	if err != nil {
		if err.Error() == "unauthorized: task does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Task not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Task status toggled successfully",
		"task":    task,
	})
}

// DeleteTask handles DELETE /api/tasks/:id
func (h *TaskHandler) DeleteTask(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse task ID
	taskID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}

	// Delete task
	err = h.taskService.DeleteTask(taskID, userID)
	if err != nil {
		if err.Error() == "unauthorized: task does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Task not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Task deleted successfully",
	})
}
