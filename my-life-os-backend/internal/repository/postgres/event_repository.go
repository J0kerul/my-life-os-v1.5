package postgres

import (
	"time"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type eventRepository struct {
	db *gorm.DB
}

// NewEventRepository creates a new event repository
func NewEventRepository(db *gorm.DB) interfaces.EventRepository {
	return &eventRepository{db: db}
}

// CreateEvent creates a new event
func (r *eventRepository) CreateEvent(event *entities.Event) error {
	return r.db.Create(event).Error
}

// FindEventByID retrieves an event by ID
func (r *eventRepository) FindEventByID(id uuid.UUID) (*entities.Event, error) {
	var event entities.Event
	err := r.db.Where("id = ?", id).First(&event).Error
	if err != nil {
		return nil, err
	}
	return &event, nil
}

// FindEventsByUserIDAndDateRange retrieves all events for a user within a date range
func (r *eventRepository) FindEventsByUserIDAndDateRange(userID uuid.UUID, start, end time.Time) ([]*entities.Event, error) {
	var events []*entities.Event

	// Query for non-recurring events in range OR recurring events that could appear in range
	err := r.db.Where("user_id = ?", userID).
		Where(
			r.db.Where("is_recurring = false AND start_date BETWEEN ? AND ?", start, end).
				Or("is_recurring = true AND start_date <= ? AND (recurrence_end IS NULL OR recurrence_end >= ?)", end, start),
		).
		Order("start_date ASC").
		Find(&events).Error

	if err != nil {
		return nil, err
	}
	return events, nil
}

// UpdateEvent updates an existing event
func (r *eventRepository) UpdateEvent(event *entities.Event) error {
	return r.db.Save(event).Error
}

// DeleteEvent deletes an event
func (r *eventRepository) DeleteEvent(id uuid.UUID) error {
	return r.db.Delete(&entities.Event{}, id).Error
}

// CreateEventException creates an event exception
func (r *eventRepository) CreateEventException(exception *entities.EventException) error {
	return r.db.Create(exception).Error
}

// FindEventExceptionsByEventID retrieves all exceptions for an event
func (r *eventRepository) FindEventExceptionsByEventID(eventID uuid.UUID) ([]*entities.EventException, error) {
	var exceptions []*entities.EventException
	err := r.db.Where("event_id = ?", eventID).
		Order("original_date ASC").
		Find(&exceptions).Error

	if err != nil {
		return nil, err
	}
	return exceptions, nil
}

// FindEventExceptionsByDateRange retrieves exceptions within a date range
func (r *eventRepository) FindEventExceptionsByDateRange(eventID uuid.UUID, start, end time.Time) ([]*entities.EventException, error) {
	var exceptions []*entities.EventException
	err := r.db.Where("event_id = ? AND original_date BETWEEN ? AND ?", eventID, start, end).
		Order("original_date ASC").
		Find(&exceptions).Error

	if err != nil {
		return nil, err
	}
	return exceptions, nil
}

// DeleteEventException deletes an exception
func (r *eventRepository) DeleteEventException(id uuid.UUID) error {
	return r.db.Delete(&entities.EventException{}, id).Error
}
