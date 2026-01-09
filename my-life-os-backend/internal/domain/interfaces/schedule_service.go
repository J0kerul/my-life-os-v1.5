package interfaces

import (
	"time"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/google/uuid"
)

// ScheduleEventService defines the interface for schedule event management business logic.
type ScheduleEventService interface {
	// CreateEvent creates a new schedule event for a user
	CreateEvent(event *entities.ScheduleEvent) error

	// GetEvent retrieves a single schedule event by its ID
	GetEvent(eventID uuid.UUID) (*entities.ScheduleEvent, error)

	// GetEventsByDateRange retrieves all events for a user within a date range (expands recurring events)
	GetEventsByDateRange(userID uuid.UUID, startDate, endDate time.Time) ([]*entities.ScheduleEvent, error)

	// UpdateEvent updates an existing schedule event
	// updateType: "single" (only this occurrence) or "future" (this and all future occurrences)
	UpdateEvent(event *entities.ScheduleEvent, updateType string) error

	// DeleteEvent removes a schedule event
	// deleteType: "single" (only this occurrence), "future" (this and all future occurrences), or "all" (entire series)
	// instanceDate: the date of the specific instance being deleted (required for "single" and "future")
	DeleteEvent(eventID uuid.UUID, deleteType string, instanceDate *time.Time) error

	// CheckConflicts checks for time conflicts with other events (excludes Holidays domain)
	CheckConflicts(event *entities.ScheduleEvent) ([]*entities.ScheduleEvent, error)
}
