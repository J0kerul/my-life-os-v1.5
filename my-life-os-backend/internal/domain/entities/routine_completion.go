package entities

import (
	"time"

	"github.com/google/uuid"
)

// RoutineCompletion represents a single completion/skip event for a routine
type RoutineCompletion struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	RoutineID   uuid.UUID `gorm:"type:uuid;not null" json:"routineId"`
	UserID      uuid.UUID `gorm:"type:uuid;not null" json:"userId"`
	CompletedAt time.Time `gorm:"type:date;not null" json:"completedAt"`   // Date only, no time
	Status      string    `gorm:"type:varchar(50);not null" json:"status"` // "completed" or "skipped"
	CreatedAt   time.Time `gorm:"not null" json:"createdAt"`
}
