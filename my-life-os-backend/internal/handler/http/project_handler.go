package http

import (
	"strings"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type ProjectHandler struct {
	projectService interfaces.ProjectService
}

// NewProjectHandler creates a new project handler
func NewProjectHandler(projectService interfaces.ProjectService) *ProjectHandler {
	return &ProjectHandler{
		projectService: projectService,
	}
}

// CreateProjectRequest represents the request body for creating a project
type CreateProjectRequest struct {
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	Status        string   `json:"status"`
	RepositoryURL string   `json:"repositoryUrl,omitempty"`
	TechStackIDs  []string `json:"techStackIds"`
}

// UpdateProjectRequest represents the request body for updating a project
type UpdateProjectRequest struct {
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	Status        string   `json:"status"`
	RepositoryURL string   `json:"repositoryUrl,omitempty"`
	TechStackIDs  []string `json:"techStackIds"`
}

// AssignTaskRequest represents the request body for assigning a task to a project
type AssignTaskRequest struct {
	TaskID string `json:"taskId"`
}

// CreateProject handles POST /api/projects
func (h *ProjectHandler) CreateProject(c *fiber.Ctx) error {
	// Get user ID from context (set by auth middleware)
	userID := c.Locals("userID").(uuid.UUID)

	// Parse request body
	var req CreateProjectRequest
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

	if req.Description == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Description is required",
		})
	}

	// Convert tech stack IDs from strings to UUIDs
	var techStackIDs []uuid.UUID
	for _, id := range req.TechStackIDs {
		techID, err := uuid.Parse(id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid tech stack ID format",
			})
		}
		techStackIDs = append(techStackIDs, techID)
	}

	// Create project
	project, err := h.projectService.CreateProject(
		userID,
		req.Title,
		req.Description,
		req.Status,
		req.RepositoryURL,
		techStackIDs,
	)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Project created successfully",
		"project": project,
	})
}

// GetProjects handles GET /api/projects
func (h *ProjectHandler) GetProjects(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Get query parameters for filtering
	status := c.Query("status")
	techStackIDsStr := c.Query("techStackIds") // Comma-separated UUIDs

	// Get projects
	var projects []*entities.Project
	var err error

	if status != "" || techStackIDsStr != "" {
		// Parse tech stack IDs if provided
		var techStackIDs []uuid.UUID
		if techStackIDsStr != "" {
			// Split comma-separated IDs and parse
			idStrs := strings.Split(techStackIDsStr, ",")
			for _, idStr := range idStrs {
				id, parseErr := uuid.Parse(strings.TrimSpace(idStr))
				if parseErr == nil {
					techStackIDs = append(techStackIDs, id)
				}
			}
		}

		projects, err = h.projectService.GetProjectsWithFilters(userID, status, techStackIDs)
	} else {
		projects, err = h.projectService.GetUserProjects(userID)
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve projects",
		})
	}

	return c.JSON(fiber.Map{
		"projects": projects,
	})
}

// GetProject handles GET /api/projects/:id
func (h *ProjectHandler) GetProject(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse project ID
	projectID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	// Get project
	project, err := h.projectService.GetProject(projectID, userID)
	if err != nil {
		if err.Error() == "unauthorized: project does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found",
		})
	}

	return c.JSON(fiber.Map{
		"project": project,
	})
}

// UpdateProject handles PUT /api/projects/:id
func (h *ProjectHandler) UpdateProject(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse project ID
	projectID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	// Parse request body
	var req UpdateProjectRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Convert tech stack IDs from strings to UUIDs
	var techStackIDs []uuid.UUID
	for _, id := range req.TechStackIDs {
		techID, err := uuid.Parse(id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid tech stack ID format",
			})
		}
		techStackIDs = append(techStackIDs, techID)
	}

	// Update project
	project, err := h.projectService.UpdateProject(
		projectID,
		userID,
		req.Title,
		req.Description,
		req.Status,
		req.RepositoryURL,
		techStackIDs,
	)
	if err != nil {
		if err.Error() == "unauthorized: project does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Project updated successfully",
		"project": project,
	})
}

// DeleteProject handles DELETE /api/projects/:id
func (h *ProjectHandler) DeleteProject(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse project ID
	projectID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	// Delete project
	err = h.projectService.DeleteProject(projectID, userID)
	if err != nil {
		if err.Error() == "unauthorized: project does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Project deleted successfully",
	})
}

// AssignTask handles POST /api/projects/:id/tasks
func (h *ProjectHandler) AssignTask(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse project ID
	projectID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	// Parse request body
	var req AssignTaskRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Parse task ID
	taskID, err := uuid.Parse(req.TaskID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task ID format",
		})
	}

	// Assign task to project
	err = h.projectService.AssignTaskToProject(projectID, taskID, userID)
	if err != nil {
		if strings.Contains(err.Error(), "unauthorized") {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Task assigned successfully",
	})
}

// UnassignTask handles DELETE /api/projects/:id/tasks/:taskId
func (h *ProjectHandler) UnassignTask(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse project ID
	projectID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	// Parse task ID
	taskID, err := uuid.Parse(c.Params("taskId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}

	// Unassign task from project
	err = h.projectService.UnassignTaskFromProject(projectID, taskID, userID)
	if err != nil {
		if err.Error() == "unauthorized: project does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Task unassigned successfully",
	})
}

// GetProjectTasks handles GET /api/projects/:id/tasks
func (h *ProjectHandler) GetProjectTasks(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse project ID
	projectID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	// Get project tasks
	tasks, err := h.projectService.GetProjectTasks(projectID, userID)
	if err != nil {
		if err.Error() == "unauthorized: project does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve project tasks",
		})
	}

	return c.JSON(fiber.Map{
		"tasks": tasks,
	})
}
