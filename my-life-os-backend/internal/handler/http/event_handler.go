package http

import (
	"time"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type EventHandler struct {
	eventService interfaces.EventService
}

// NewEventHandler creates a new event handler
func NewEventHandler(eventService interfaces.EventService) *EventHandler {
	return &EventHandler{
		eventService: eventService,
	}
}

// CreateEventRequest represents the request body for creating an event
type CreateEventRequest struct {
	Title          string  `json:"title"`
	StartDate      string  `json:"startDate"` // ISO 8601 format
	EndDate        *string `json:"endDate"`   // Optional, ISO 8601 format
	AllDay         bool    `json:"allDay"`
	Domain         string  `json:"domain"`
	IsRecurring    bool    `json:"isRecurring"`
	RecurrenceType *string `json:"recurrenceType"` // daily, weekly, monthly, yearly
	RecurrenceEnd  *string `json:"recurrenceEnd"`  // Optional, ISO 8601 format
	RecurrenceDays *string `json:"recurrenceDays"` // JSON array for weekly: ["monday","wednesday"]
	HideFromAgenda bool    `json:"hideFromAgenda"`
}

// UpdateEventRequest represents the request body for updating an event
type UpdateEventRequest struct {
	OccurrenceDate *string `json:"occurrenceDate"` // Required for recurring events with "this" or "following" scope
	EditScope      string  `json:"editScope"`      // "this", "following", "all"
	Title          string  `json:"title"`
	StartDate      string  `json:"startDate"` // ISO 8601 format
	EndDate        *string `json:"endDate"`   // Optional, ISO 8601 format
	AllDay         bool    `json:"allDay"`
	Domain         string  `json:"domain"`
	RecurrenceType *string `json:"recurrenceType"` // For "following" and "all" scope
	RecurrenceEnd  *string `json:"recurrenceEnd"`  // Optional, ISO 8601 format
	RecurrenceDays *string `json:"recurrenceDays"` // JSON array for weekly
	HideFromAgenda bool    `json:"hideFromAgenda"`
}

// DeleteEventRequest represents the request body for deleting an event
type DeleteEventRequest struct {
	OccurrenceDate *string `json:"occurrenceDate"` // Required for recurring events with "this" or "following" scope
	DeleteScope    string  `json:"deleteScope"`    // "this", "following", "all"
}

// CreateEvent handles POST /api/events
func (h *EventHandler) CreateEvent(c *fiber.Ctx) error {
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

	if req.StartDate == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Start date is required",
		})
	}

	if req.Domain == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Domain is required",
		})
	}

	// Parse dates
	startDate, err := time.Parse(time.RFC3339, req.StartDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid start date format",
		})
	}

	var endDate *time.Time
	if req.EndDate != nil && *req.EndDate != "" {
		parsedEndDate, err := time.Parse(time.RFC3339, *req.EndDate)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid end date format",
			})
		}
		endDate = &parsedEndDate
	}

	var recurrenceEnd *time.Time
	if req.RecurrenceEnd != nil && *req.RecurrenceEnd != "" {
		parsedRecurrenceEnd, err := time.Parse(time.RFC3339, *req.RecurrenceEnd)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid recurrence end date format",
			})
		}
		recurrenceEnd = &parsedRecurrenceEnd
	}

	// Create event
	event, err := h.eventService.CreateEvent(
		userID,
		req.Title,
		startDate,
		endDate,
		req.AllDay,
		req.Domain,
		req.IsRecurring,
		req.RecurrenceType,
		recurrenceEnd,
		req.RecurrenceDays,
		req.HideFromAgenda,
	)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Event created successfully",
		"event":   event,
	})
}

// GetEvents handles GET /api/events?start=...&end=...
func (h *EventHandler) GetEvents(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Get query parameters
	startStr := c.Query("start")
	endStr := c.Query("end")

	// Validate required parameters
	if startStr == "" || endStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Start and end dates are required",
		})
	}

	// Parse dates
	start, err := time.Parse(time.RFC3339, startStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid start date format",
		})
	}

	end, err := time.Parse(time.RFC3339, endStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid end date format",
		})
	}

	// Get events (expanded with occurrences)
	events, err := h.eventService.GetUserEventsInRange(userID, start, end)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve events",
		})
	}

	return c.JSON(fiber.Map{
		"events": events,
	})
}

// GetEvent handles GET /api/events/:id
func (h *EventHandler) GetEvent(c *fiber.Ctx) error {
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
	event, err := h.eventService.GetEvent(eventID, userID)
	if err != nil {
		if err.Error() == "unauthorized: event does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Event not found",
		})
	}

	return c.JSON(fiber.Map{
		"event": event,
	})
}

// UpdateEvent handles PUT /api/events/:id
func (h *EventHandler) UpdateEvent(c *fiber.Ctx) error {
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

	// Validate edit scope
	if req.EditScope == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Edit scope is required",
		})
	}

	// Parse occurrence date if provided
	var occurrenceDate *time.Time
	if req.OccurrenceDate != nil && *req.OccurrenceDate != "" {
		parsedOccurrenceDate, err := time.Parse(time.RFC3339, *req.OccurrenceDate)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid occurrence date format",
			})
		}
		occurrenceDate = &parsedOccurrenceDate
	}

	// Parse dates
	startDate, err := time.Parse(time.RFC3339, req.StartDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid start date format",
		})
	}

	var endDate *time.Time
	if req.EndDate != nil && *req.EndDate != "" {
		parsedEndDate, err := time.Parse(time.RFC3339, *req.EndDate)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid end date format",
			})
		}
		endDate = &parsedEndDate
	}

	var recurrenceEnd *time.Time
	if req.RecurrenceEnd != nil && *req.RecurrenceEnd != "" {
		parsedRecurrenceEnd, err := time.Parse(time.RFC3339, *req.RecurrenceEnd)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid recurrence end date format",
			})
		}
		recurrenceEnd = &parsedRecurrenceEnd
	}

	// Update event
	event, err := h.eventService.UpdateEvent(
		eventID,
		userID,
		occurrenceDate,
		req.EditScope,
		req.Title,
		startDate,
		endDate,
		req.AllDay,
		req.Domain,
		req.RecurrenceType,
		recurrenceEnd,
		req.RecurrenceDays,
		req.HideFromAgenda,
	)
	if err != nil {
		if err.Error() == "unauthorized: event does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Event updated successfully",
		"event":   event,
	})
}

// DeleteEvent handles DELETE /api/events/:id
func (h *EventHandler) DeleteEvent(c *fiber.Ctx) error {
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
	var req DeleteEventRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate delete scope
	if req.DeleteScope == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Delete scope is required",
		})
	}

	// Parse occurrence date if provided
	var occurrenceDate *time.Time
	if req.OccurrenceDate != nil && *req.OccurrenceDate != "" {
		parsedOccurrenceDate, err := time.Parse(time.RFC3339, *req.OccurrenceDate)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid occurrence date format",
			})
		}
		occurrenceDate = &parsedOccurrenceDate
	}

	// Delete event
	err = h.eventService.DeleteEvent(eventID, userID, occurrenceDate, req.DeleteScope)
	if err != nil {
		if err.Error() == "unauthorized: event does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Event deleted successfully",
	})
}
