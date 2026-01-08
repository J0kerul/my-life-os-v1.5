package interfaces

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"

	"github.com/google/uuid"
)

// RoutineRepository defines the interface for routine data access
type RoutineRepository interface {
	// CreateRoutine creates a new routine in the database
	CreateRoutine(routine *entities.Routine) error

	// GetRoutineByID retrieves a routine by its ID
	GetRoutineByID(id uuid.UUID) (*entities.Routine, error)

	//GetRoutinesByUserID retrieves all routines for a specific user
	GetRoutinesByUserID(userID uuid.UUID) ([]*entities.Routine, error)

	// UpdateRoutine updates an existing routine in the database
	UpdateRoutine(routine *entities.Routine) error

	// DeleteRoutine deletes a routine by its ID
	DeleteRoutine(id uuid.UUID) error

	// // Update streak counters
	UpdateStreak(id uuid.UUID, currentStreak, longestStreak int) error
}
