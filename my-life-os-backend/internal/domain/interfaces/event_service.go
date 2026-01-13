package interfaces

import (
	"time"

	"github.com/google/uuid"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
)

// EventService defines methods for event business logic.
type EventService interface {
	// CreateEvent creates a new event
	CreateEvent(userID uuid.UUID, title string, startDate time.Time, endDate *time.Time, allDay bool,
		domain string, isRecurring bool, recurrenceType *string, recurrenceEnd *time.Time,
		recurrenceDays *string, hideFromAgenda bool) (*entities.Event, error)

	// GetEvent retrieves a single event (ensures user owns it)
	GetEvent(eventID, userID uuid.UUID) (*entities.Event, error)

	// GetUserEventsInRange retrieves all events (expanded occurrences) for a user in date range
	GetUserEventsInRange(userID uuid.UUID, start, end time.Time) ([]*entities.Event, error)

	// UpdateEvent updates an event (with edit scope: "this", "following", "all")
	UpdateEvent(eventID, userID uuid.UUID, occurrenceDate *time.Time, editScope string,
		title string, startDate time.Time, endDate *time.Time, allDay bool, domain string,
		recurrenceType *string, recurrenceEnd *time.Time, recurrenceDays *string, hideFromAgenda bool) (*entities.Event, error)

	// DeleteEvent deletes an event (with delete scope: "this", "following", "all")
	DeleteEvent(eventID, userID uuid.UUID, occurrenceDate *time.Time, deleteScope string) error

	// CheckConflict checks if event conflicts with existing events (only for non-all-day)
	CheckConflict(userID uuid.UUID, startDate time.Time, endDate *time.Time, allDay bool, excludeEventID *uuid.UUID) (bool, error)
}
