package interfaces

import (
	"time"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"

	"github.com/google/uuid"
)

// RoutineRepository defines the interface for routine data access
type RoutineRepository interface {
	// Create a new routine
	CreateRoutine(routine *entities.Routine) error

	// Get routine by ID
	GetRoutineByID(id uuid.UUID) (*entities.Routine, error)

	// Get all routines for a user with optional frequency filter
	GetRoutinesByUserID(userID uuid.UUID, frequency *string) ([]*entities.Routine, error)

	// Update routine
	UpdateRoutine(routine *entities.Routine) error

	// Delete routine
	DeleteRoutine(id uuid.UUID) error

	// Update streak counters
	UpdateStreak(id uuid.UUID, currentStreak, longestStreak int) error

	// Completion tracking methods
	// Check if routine was completed/skipped on a specific date
	GetCompletionForDate(routineID uuid.UUID, date time.Time) (*entities.RoutineCompletion, error)

	// Record a completion/skip event
	RecordCompletion(completion *entities.RoutineCompletion) error

	// Get completion history for a routine (for streak calculation)
	GetCompletionHistory(routineID uuid.UUID, limit int) ([]*entities.RoutineCompletion, error)
}
