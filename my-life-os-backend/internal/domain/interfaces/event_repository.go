package interfaces

import (
	"time"

	"github.com/google/uuid"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
)

type EventRepository interface {
	// CreateEvent adds a new event to the database.
	CreateEvent(event *entities.Event) error

	// FindEventByID retrieves an event by its ID.
	FindEventByID(eventID uuid.UUID) (*entities.Event, error)

	// FindEventsByUserIDAndDateRange retrieves all events for a user within a date range
	FindEventsByUserIDAndDateRange(userID uuid.UUID, start, end time.Time) ([]*entities.Event, error)

	// UpdateEvent modifies an existing event.
	UpdateEvent(event *entities.Event) error

	// DeleteEvent removes an event from the database.
	DeleteEvent(eventID uuid.UUID) error

	// Exception handling
	CreateEventException(exception *entities.EventException) error
	FindEventExceptionsByEventID(eventID uuid.UUID) ([]*entities.EventException, error)
	FindEventExceptionsByDateRange(eventID uuid.UUID, start, end time.Time) ([]*entities.EventException, error)
	DeleteEventException(exceptionID uuid.UUID) error
}
