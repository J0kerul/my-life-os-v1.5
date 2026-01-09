package http

import (
	"log"
	"time"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type ScheduleEventHandler struct {
	scheduleService interfaces.ScheduleEventService
}

// NewScheduleEventHandler creates a new schedule event handler
func NewScheduleEventHandler(scheduleService interfaces.ScheduleEventService) *ScheduleEventHandler {
	return &ScheduleEventHandler{
		scheduleService: scheduleService,
	}
}

// CreateEventRequest represents the request body for creating a schedule event
type CreateEventRequest struct {
	Title             string  `json:"title"`
	Description       string  `json:"description"`
	Domain            string  `json:"domain"`
	StartDate         string  `json:"startDate"` // ISO 8601 format
	EndDate           string  `json:"endDate"`   // ISO 8601 format
	IsAllDay          bool    `json:"isAllDay"`
	Location          string  `json:"location"`
	LinkedTaskID      *string `json:"linkedTaskId"`      // Optional UUID as string
	Recurrence        string  `json:"recurrence"`        // none, daily, weekly, monthly, yearly
	RecurrenceEndDate *string `json:"recurrenceEndDate"` // Optional ISO 8601 format
	RecurrenceDays    *string `json:"recurrenceDays"`    // Optional JSON array of weekday numbers (0=Sunday, 1=Monday, etc.)
}

// UpdateEventRequest represents the request body for updating a schedule event
type UpdateEventRequest struct {
	Title             string  `json:"title"`
	Description       string  `json:"description"`
	Domain            string  `json:"domain"`
	StartDate         string  `json:"startDate"` // ISO 8601 format
	EndDate           string  `json:"endDate"`   // ISO 8601 format
	IsAllDay          bool    `json:"isAllDay"`
	Location          string  `json:"location"`
	LinkedTaskID      *string `json:"linkedTaskId"`      // Optional UUID as string
	Recurrence        string  `json:"recurrence"`        // none, daily, weekly, monthly, yearly
	RecurrenceEndDate *string `json:"recurrenceEndDate"` // Optional ISO 8601 format
	RecurrenceDays    *string `json:"recurrenceDays"`    // Optional JSON array of weekday numbers (0=Sunday, 1=Monday, etc.)
	UpdateType        string  `json:"updateType"`        // "single" or "future"
}

// DeleteEventRequest represents the request body for deleting a schedule event
type DeleteEventRequest struct {
	DeleteType   string  `json:"deleteType"`   // "single", "future", or "all"
	InstanceDate *string `json:"instanceDate"` // ISO 8601 format - the date of the clicked instance (for "single" and "future")
}

// CreateEvent handles POST /api/schedule
func (h *ScheduleEventHandler) CreateEvent(c *fiber.Ctx) error {
	// Get user ID from context (set by auth middleware)
	userID := c.Locals("userID").(uuid.UUID)

	// Parse request body
	var req CreateEventRequest
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

	if req.StartDate == "" || req.EndDate == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Start date and end date are required",
		})
	}

	// Parse dates
	startDate, err := time.Parse(time.RFC3339, req.StartDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid start date format, use ISO 8601",
		})
	}

	endDate, err := time.Parse(time.RFC3339, req.EndDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid end date format, use ISO 8601",
		})
	}

	// Parse optional linked task ID
	var linkedTaskID *uuid.UUID
	if req.LinkedTaskID != nil && *req.LinkedTaskID != "" {
		taskID, err := uuid.Parse(*req.LinkedTaskID)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid linked task ID",
			})
		}
		linkedTaskID = &taskID
	}

	// Parse optional recurrence end date
	var recurrenceEndDate *time.Time
	if req.RecurrenceEndDate != nil && *req.RecurrenceEndDate != "" {
		parsed, err := time.Parse(time.RFC3339, *req.RecurrenceEndDate)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid recurrence end date format, use ISO 8601",
			})
		}
		recurrenceEndDate = &parsed
	}

	// Create event
	event := &entities.ScheduleEvent{
		UserID:            userID,
		Title:             req.Title,
		Description:       req.Description,
		Domain:            req.Domain,
		StartDate:         startDate,
		EndDate:           endDate,
		IsAllDay:          req.IsAllDay,
		Location:          req.Location,
		LinkedTaskID:      linkedTaskID,
		Recurrence:        req.Recurrence,
		RecurrenceEndDate: recurrenceEndDate,
		RecurrenceDays:    req.RecurrenceDays,
	}

	if err := h.scheduleService.CreateEvent(event); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Check for conflicts
	conflicts, err := h.scheduleService.CheckConflicts(event)
	if err != nil {
		// Don't fail if conflict check fails, just log it
		log.Printf("Failed to check conflicts: %v", err)
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":   "Event created successfully",
		"event":     event,
		"conflicts": conflicts,
	})
}

// GetEvents handles GET /api/schedule?start=...&end=...
func (h *ScheduleEventHandler) GetEvents(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Get query parameters
	startParam := c.Query("start")
	endParam := c.Query("end")

	if startParam == "" || endParam == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Start and end date query parameters are required",
		})
	}

	// Parse dates
	startDate, err := time.Parse(time.RFC3339, startParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid start date format, use ISO 8601",
		})
	}

	endDate, err := time.Parse(time.RFC3339, endParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid end date format, use ISO 8601",
		})
	}

	// Get events
	events, err := h.scheduleService.GetEventsByDateRange(userID, startDate, endDate)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve events",
		})
	}

	return c.JSON(fiber.Map{
		"events": events,
	})
}

// GetEvent handles GET /api/schedule/:id
func (h *ScheduleEventHandler) GetEvent(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse event ID
	eventID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid event ID",
		})
	}

	// Get event
	event, err := h.scheduleService.GetEvent(eventID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Event not found",
		})
	}

	// Verify ownership
	if event.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Access denied",
		})
	}

	return c.JSON(fiber.Map{
		"event": event,
	})
}

// UpdateEvent handles PUT /api/schedule/:id
func (h *ScheduleEventHandler) UpdateEvent(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse event ID
	eventID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid event ID",
		})
	}

	// Parse request body
	var req UpdateEventRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Get existing event
	existingEvent, err := h.scheduleService.GetEvent(eventID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Event not found",
		})
	}

	// Verify ownership
	if existingEvent.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Access denied",
		})
	}

	// Parse dates
	startDate, err := time.Parse(time.RFC3339, req.StartDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid start date format",
		})
	}

	endDate, err := time.Parse(time.RFC3339, req.EndDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid end date format",
		})
	}

	// Parse optional linked task ID
	var linkedTaskID *uuid.UUID
	if req.LinkedTaskID != nil && *req.LinkedTaskID != "" {
		taskID, err := uuid.Parse(*req.LinkedTaskID)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid linked task ID",
			})
		}
		linkedTaskID = &taskID
	}

	// Parse optional recurrence end date
	var recurrenceEndDate *time.Time
	if req.RecurrenceEndDate != nil && *req.RecurrenceEndDate != "" {
		parsed, err := time.Parse(time.RFC3339, *req.RecurrenceEndDate)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid recurrence end date format",
			})
		}
		recurrenceEndDate = &parsed
	}

	// Update event
	existingEvent.Title = req.Title
	existingEvent.Description = req.Description
	existingEvent.Domain = req.Domain
	existingEvent.StartDate = startDate
	existingEvent.EndDate = endDate
	existingEvent.IsAllDay = req.IsAllDay
	existingEvent.Location = req.Location
	existingEvent.LinkedTaskID = linkedTaskID
	existingEvent.Recurrence = req.Recurrence
	existingEvent.RecurrenceEndDate = recurrenceEndDate
	existingEvent.RecurrenceDays = req.RecurrenceDays

	// Default update type to "single" if not provided
	updateType := req.UpdateType
	if updateType == "" {
		updateType = "single"
	}

	if err := h.scheduleService.UpdateEvent(existingEvent, updateType); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Event updated successfully",
		"event":   existingEvent,
	})
}

// DeleteEvent handles DELETE /api/schedule/:id
func (h *ScheduleEventHandler) DeleteEvent(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse event ID
	eventID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid event ID",
		})
	}

	// Get existing event to verify ownership
	existingEvent, err := h.scheduleService.GetEvent(eventID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Event not found",
		})
	}

	// Verify ownership
	if existingEvent.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Access denied",
		})
	}

	// Parse request body for delete type
	var req DeleteEventRequest
	if err := c.BodyParser(&req); err != nil {
		// Default to "single" if no body provided
		req.DeleteType = "single"
	}

	// Default to "single" if not provided
	deleteType := req.DeleteType
	if deleteType == "" {
		deleteType = "single"
	}

	// Parse instance date if provided
	var instanceDate *time.Time
	if req.InstanceDate != nil && *req.InstanceDate != "" {
		parsedDate, err := time.Parse(time.RFC3339, *req.InstanceDate)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid instance date format",
			})
		}
		instanceDate = &parsedDate
	}

	if err := h.scheduleService.DeleteEvent(eventID, deleteType, instanceDate); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Event deleted successfully",
	})
}
