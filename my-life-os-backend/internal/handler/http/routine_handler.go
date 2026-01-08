package http

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type RoutineHandler struct {
	routineService interfaces.RoutineService
}

// NewRoutineHandler creates a new routine handler
func NewRoutineHandler(routineService interfaces.RoutineService) *RoutineHandler {
	return &RoutineHandler{
		routineService: routineService,
	}
}

// CreateRoutineRequest represents the request body for creating a routine
type CreateRoutineRequest struct {
	Title        string               `json:"title"`
	Frequency    string               `json:"frequency"`
	Weekday      *int                 `json:"weekday"`
	DayOfMonth   *int                 `json:"dayOfMonth"`
	QuarterlyDay *int                 `json:"quarterlyDay"`
	YearlyDate   *entities.YearlyDate `json:"yearlyDate"`
	IsSkippable  bool                 `json:"isSkippable"`
	ShowStreak   bool                 `json:"showStreak"`
	TimeType     string               `json:"timeType"`
	SpecificTime *string              `json:"specificTime"`
}

// UpdateRoutineRequest represents the request body for updating a routine
type UpdateRoutineRequest struct {
	Title        *string              `json:"title"`
	Frequency    *string              `json:"frequency"`
	Weekday      *int                 `json:"weekday"`
	DayOfMonth   *int                 `json:"dayOfMonth"`
	QuarterlyDay *int                 `json:"quarterlyDay"`
	YearlyDate   *entities.YearlyDate `json:"yearlyDate"`
	IsSkippable  *bool                `json:"isSkippable"`
	ShowStreak   *bool                `json:"showStreak"`
	TimeType     *string              `json:"timeType"`
	SpecificTime *string              `json:"specificTime"`
}

// CreateRoutine handles POST /api/routines
func (h *RoutineHandler) CreateRoutine(c *fiber.Ctx) error {
	// Get user ID from context (set by auth middleware)
	userID := c.Locals("userID").(uuid.UUID)

	// Parse request body
	var req CreateRoutineRequest
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

	if req.Frequency == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Frequency is required",
		})
	}

	if req.TimeType == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "TimeType is required",
		})
	}

	// Create routine
	routine, err := h.routineService.CreateRoutine(
		userID,
		req.Title,
		req.Frequency,
		req.Weekday,
		req.DayOfMonth,
		req.QuarterlyDay,
		req.YearlyDate,
		req.IsSkippable,
		req.ShowStreak,
		req.TimeType,
		req.SpecificTime,
	)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Routine created successfully",
		"routine": routine,
	})
}

// GetRoutines handles GET /api/routines
func (h *RoutineHandler) GetRoutines(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Get query parameters
	frequency := c.Query("frequency")

	var frequencyPtr *string
	if frequency != "" {
		frequencyPtr = &frequency
	}

	// Get routines
	routines, err := h.routineService.GetRoutines(userID, frequencyPtr)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve routines",
		})
	}

	return c.JSON(fiber.Map{
		"routines": routines,
	})
}

// GetRoutine handles GET /api/routines/:id
func (h *RoutineHandler) GetRoutine(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse routine ID
	routineID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid routine ID",
		})
	}

	// Get routine
	routine, err := h.routineService.GetRoutine(routineID, userID)
	if err != nil {
		if err.Error() == "unauthorized: routine does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Routine not found",
		})
	}

	return c.JSON(fiber.Map{
		"routine": routine,
	})
}

// UpdateRoutine handles PUT /api/routines/:id
func (h *RoutineHandler) UpdateRoutine(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse routine ID
	routineID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid routine ID",
		})
	}

	// Parse request body
	var req UpdateRoutineRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Update routine
	routine, err := h.routineService.UpdateRoutine(
		routineID,
		userID,
		req.Title,
		req.Frequency,
		req.Weekday,
		req.DayOfMonth,
		req.QuarterlyDay,
		req.YearlyDate,
		req.IsSkippable,
		req.ShowStreak,
		req.TimeType,
		req.SpecificTime,
	)
	if err != nil {
		if err.Error() == "unauthorized: routine does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Routine updated successfully",
		"routine": routine,
	})
}

// DeleteRoutine handles DELETE /api/routines/:id
func (h *RoutineHandler) DeleteRoutine(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse routine ID
	routineID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid routine ID",
		})
	}

	// Delete routine
	err = h.routineService.DeleteRoutine(routineID, userID)
	if err != nil {
		if err.Error() == "unauthorized: routine does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Routine not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Routine deleted successfully",
	})
}

// CompleteRoutine handles PATCH /api/routines/:id/complete
func (h *RoutineHandler) CompleteRoutine(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse routine ID
	routineID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid routine ID",
		})
	}

	// Complete routine
	err = h.routineService.CompleteRoutine(routineID, userID)
	if err != nil {
		if err.Error() == "unauthorized: routine does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		if err.Error() == "routine already completed or skipped today" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Routine completed successfully",
	})
}

// SkipRoutine handles PATCH /api/routines/:id/skip
func (h *RoutineHandler) SkipRoutine(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse routine ID
	routineID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid routine ID",
		})
	}

	// Skip routine
	err = h.routineService.SkipRoutine(routineID, userID)
	if err != nil {
		if err.Error() == "unauthorized: routine does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		if err.Error() == "routine already completed or skipped today" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Routine skipped successfully",
	})
}

// GetTodaysRoutines handles GET /api/routines/today
func (h *RoutineHandler) GetTodaysRoutines(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Get today's routines
	routines, err := h.routineService.GetTodaysRoutines(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve today's routines",
		})
	}

	return c.JSON(fiber.Map{
		"routines": routines,
	})
}
