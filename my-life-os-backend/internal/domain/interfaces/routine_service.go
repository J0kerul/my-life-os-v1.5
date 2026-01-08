package interfaces

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"

	"github.com/google/uuid"
)

// RoutineService defines the interface for routine business logic
type RoutineService interface {
	// CreateRoutine creates a new routine for a user
	CreateRoutine(
		userID uuid.UUID,
		title, frequency string,
		weekday, dayOfMonth, quarterlyDay *int,
		yearlyDate *entities.YearlyDate,
		isSkippable, showStreak bool,
		timeType string,
		specificTime *string,
	) (*entities.Routine, error)

	// GetRoutine retrieves a single routine by its ID for a user
	GetRoutine(routineID, userID uuid.UUID) (*entities.Routine, error)

	// GetRoutines retrieves all routines for a user with optional frequency filter
	GetRoutines(userID uuid.UUID, frequency *string) ([]*entities.Routine, error)

	// UpdateRoutine updates an existing routine for a user
	UpdateRoutine(
		routineID, userID uuid.UUID,
		title, frequency *string,
		weekday, dayOfMonth, quarterlyDay *int,
		yearlyDate *entities.YearlyDate,
		isSkippable, showStreak *bool,
		timeType, specificTime *string,
	) (*entities.Routine, error)

	// DeleteRoutine removes a routine by its ID for a user
	DeleteRoutine(routineID, userID uuid.UUID) error

	// CompleteRoutine marks routine as done for current cycle and updates streak
	CompleteRoutine(routineID, userID uuid.UUID) error

	// SkipRoutine marks routine as skipped for current cycle (preserves streak if skippable)
	SkipRoutine(routineID, userID uuid.UUID) error

	// GetTodaysRoutines retrieves routines relevant for today based on frequency and schedule
	GetTodaysRoutines(userID uuid.UUID) ([]*entities.Routine, error)
}
