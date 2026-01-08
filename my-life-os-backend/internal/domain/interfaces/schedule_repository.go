package interfaces

import (
	"time"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/google/uuid"
)

// ScheduleEventRepository defines methods for schedule event data access.
type ScheduleEventRepository interface {
	// CreateEvent adds a new schedule event to the database
	CreateEvent(event *entities.ScheduleEvent) error

	// FindEventByID retrieves a schedule event by its ID
	FindEventByID(eventID uuid.UUID) (*entities.ScheduleEvent, error)

	// FindEventsByUserID retrieves all schedule events for a user
	FindEventsByUserID(userID uuid.UUID) ([]*entities.ScheduleEvent, error)

	// FindEventsByDateRange retrieves events within a specific date range for a user
	FindEventsByDateRange(userID uuid.UUID, startDate, endDate time.Time) ([]*entities.ScheduleEvent, error)

	// UpdateEvent modifies an existing schedule event
	UpdateEvent(event *entities.ScheduleEvent) error

	// DeleteEvent removes a schedule event from the database
	DeleteEvent(eventID uuid.UUID) error

	// FindRecurringEvents retrieves all recurring events for a user
	FindRecurringEvents(userID uuid.UUID) ([]*entities.ScheduleEvent, error)

	// FindExceptions retrieves all exceptions for a recurring event
	FindExceptions(parentEventID uuid.UUID) ([]*entities.ScheduleEvent, error)
}
