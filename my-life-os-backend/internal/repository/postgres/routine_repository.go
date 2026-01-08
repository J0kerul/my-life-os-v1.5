package postgres

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
)

type routineRepository struct {
	db *gorm.DB
}

// NewRoutineRepository creates a new routine repository
func NewRoutineRepository(db *gorm.DB) interfaces.RoutineRepository {
	return &routineRepository{db: db}
}

// CreateRoutine creates a new routine
func (r *routineRepository) CreateRoutine(routine *entities.Routine) error {
	return r.db.Create(routine).Error
}

// GetRoutineByID retrieves a routine by ID
func (r *routineRepository) GetRoutineByID(id uuid.UUID) (*entities.Routine, error) {
	var routine entities.Routine
	err := r.db.Where("id = ?", id).First(&routine).Error
	if err != nil {
		return nil, err
	}
	return &routine, nil
}

// GetByUserID retrieves all routines for a user with optional frequency filter
func (r *routineRepository) GetRoutinesByUserID(userID uuid.UUID, frequency *string) ([]*entities.Routine, error) {
	var routines []*entities.Routine

	query := r.db.Where("user_id = ?", userID)

	// Apply frequency filter if provided
	if frequency != nil && *frequency != "" {
		query = query.Where("frequency = ?", *frequency)
	}

	// Order by created_at descending (newest first)
	err := query.Order("created_at DESC").Find(&routines).Error
	if err != nil {
		return nil, err
	}

	return routines, nil
}

// UpdateRoutine updates a routine
func (r *routineRepository) UpdateRoutine(routine *entities.Routine) error {
	return r.db.Save(routine).Error
}

// DeleteRoutine deletes a routine
func (r *routineRepository) DeleteRoutine(id uuid.UUID) error {
	return r.db.Delete(&entities.Routine{}, id).Error
}

// UpdateStreak updates the streak counters for a routine
func (r *routineRepository) UpdateStreak(id uuid.UUID, currentStreak, longestStreak int) error {
	return r.db.Model(&entities.Routine{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"current_streak": currentStreak,
			"longest_streak": longestStreak,
		}).Error
}

// GetCompletionForDate checks if a routine was completed/skipped on a specific date
func (r *routineRepository) GetCompletionForDate(routineID uuid.UUID, date time.Time) (*entities.RoutineCompletion, error) {
	var completion entities.RoutineCompletion
	// Normalize date to start of day for comparison
	dateOnly := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, time.UTC)

	err := r.db.Where("routine_id = ? AND completed_at = ?", routineID, dateOnly).
		First(&completion).Error
	if err != nil {
		return nil, err
	}
	return &completion, nil
}

// RecordCompletion records a completion/skip event
func (r *routineRepository) RecordCompletion(completion *entities.RoutineCompletion) error {
	return r.db.Create(completion).Error
}

// GetCompletionHistory retrieves completion history for a routine (newest first)
func (r *routineRepository) GetCompletionHistory(routineID uuid.UUID, limit int) ([]*entities.RoutineCompletion, error) {
	var completions []*entities.RoutineCompletion

	err := r.db.Where("routine_id = ?", routineID).
		Order("completed_at DESC").
		Limit(limit).
		Find(&completions).Error
	if err != nil {
		return nil, err
	}

	return completions, nil
}
