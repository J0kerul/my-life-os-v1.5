package postgres

import (
	"gorm.io/gorm"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
	"github.com/google/uuid"
)

type routineRepository struct {
	db *gorm.DB
}

// NewRoutineRepository creates a new instance of RoutineRepository
func NewRoutineRepository(db *gorm.DB) interfaces.RoutineRepository {
	return &routineRepository{db: db}
}

// CreateRoutine creates a new routine in the database
func (r *routineRepository) CreateRoutine(routine *entities.Routine) error {
	return r.db.Create(routine).Error
}

// GetRoutineByID retrieves a routine by its ID
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

// UpdateRoutine updates an existing routine in the database
func (r *routineRepository) UpdateRoutine(routine *entities.Routine) error {
	return r.db.Save(routine).Error
}

// DeleteRoutine deletes a routine by its ID
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
