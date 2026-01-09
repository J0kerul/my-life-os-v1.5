package postgres

import (
	"time"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type scheduleEventRepository struct {
	db *gorm.DB
}

// NewScheduleEventRepository creates a new schedule event repository
func NewScheduleEventRepository(db *gorm.DB) interfaces.ScheduleEventRepository {
	return &scheduleEventRepository{db: db}
}

// CreateEvent creates a new schedule event
func (r *scheduleEventRepository) CreateEvent(event *entities.ScheduleEvent) error {
	return r.db.Create(event).Error
}

// FindEventByID retrieves a schedule event by ID
func (r *scheduleEventRepository) FindEventByID(id uuid.UUID) (*entities.ScheduleEvent, error) {
	var event entities.ScheduleEvent
	err := r.db.Where("id = ?", id).First(&event).Error
	if err != nil {
		return nil, err
	}
	return &event, nil
}

// FindEventsByUserID retrieves all schedule events for a user
func (r *scheduleEventRepository) FindEventsByUserID(userID uuid.UUID) ([]*entities.ScheduleEvent, error) {
	var events []*entities.ScheduleEvent
	err := r.db.Where("user_id = ?", userID).
		Order("start_date ASC").
		Find(&events).Error
	if err != nil {
		return nil, err
	}
	return events, nil
}

// FindEventsByDateRange retrieves events within a specific date range for a user
// Only returns non-recurring events (recurring events are handled separately and expanded)
func (r *scheduleEventRepository) FindEventsByDateRange(userID uuid.UUID, startDate, endDate time.Time) ([]*entities.ScheduleEvent, error) {
	var events []*entities.ScheduleEvent
	err := r.db.Where("user_id = ?", userID).
		Where("(start_date BETWEEN ? AND ?) OR (end_date BETWEEN ? AND ?) OR (start_date <= ? AND end_date >= ?)",
			startDate, endDate, startDate, endDate, startDate, endDate).
		Where("parent_event_id IS NULL").
		Where("recurrence = ?", entities.RecurrenceNone). // Only non-recurring events
		Order("start_date ASC").
		Find(&events).Error
	if err != nil {
		return nil, err
	}
	return events, nil
}

// UpdateEvent updates a schedule event
func (r *scheduleEventRepository) UpdateEvent(event *entities.ScheduleEvent) error {
	return r.db.Save(event).Error
}

// DeleteEvent deletes a schedule event
func (r *scheduleEventRepository) DeleteEvent(id uuid.UUID) error {
	return r.db.Delete(&entities.ScheduleEvent{}, id).Error
}

// FindRecurringEvents retrieves all recurring events for a user
func (r *scheduleEventRepository) FindRecurringEvents(userID uuid.UUID) ([]*entities.ScheduleEvent, error) {
	var events []*entities.ScheduleEvent
	err := r.db.Where("user_id = ?", userID).
		Where("recurrence != ?", entities.RecurrenceNone).
		Where("parent_event_id IS NULL").
		Order("start_date ASC").
		Find(&events).Error
	if err != nil {
		return nil, err
	}
	return events, nil
}

// FindExceptions retrieves all exceptions for a recurring event
func (r *scheduleEventRepository) FindExceptions(parentEventID uuid.UUID) ([]*entities.ScheduleEvent, error) {
	var events []*entities.ScheduleEvent
	err := r.db.Where("parent_event_id = ?", parentEventID).
		Order("exception_date ASC").
		Find(&events).Error
	if err != nil {
		return nil, err
	}
	return events, nil
}

// DeleteExceptionsByParentID deletes all exception events for a parent event
func (r *scheduleEventRepository) DeleteExceptionsByParentID(parentEventID uuid.UUID) error {
	return r.db.Where("parent_event_id = ?", parentEventID).Delete(&entities.ScheduleEvent{}).Error
}
