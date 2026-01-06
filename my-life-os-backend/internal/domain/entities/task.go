package entities

import (
	"time"

	"github.com/google/uuid"
)

// Task priority levels
const (
	PriorityLow    = "Low"
	PriorityMedium = "Medium"
	PriorityHigh   = "High"
)

// Task status
const (
	StatusTodo = "Todo"
	StatusDone = "Done"
)

// Task domains/categories
const (
	DomainWork            = "Work"
	DomainUniversity      = "University"
	DomainCodingProject   = "Coding Project"
	DomainPersonalProject = "Personal Project"
	DomainGoals           = "Goals"
	DomainFinances        = "Finances"
	DomainHousehold       = "Household"
	DomainHealth          = "Health"
)

// Task represents a user's task/todo item
type Task struct {
	ID          uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	UserID      uuid.UUID  `gorm:"type:uuid;not null;index" json:"userId"`
	Title       string     `gorm:"type:text;not null" json:"title"`
	Description string     `gorm:"type:text" json:"description"`
	Priority    string     `gorm:"type:text;not null;default:'Medium'" json:"priority"`
	Status      string     `gorm:"type:text;not null;default:'Todo'" json:"status"`
	Domain      string     `gorm:"type:text;not null" json:"domain"`
	Deadline    *time.Time `gorm:"type:timestamptz" json:"deadline"`
	CreatedAt   time.Time  `gorm:"type:timestamptz;not null" json:"createdAt"`
	UpdatedAt   time.Time  `gorm:"type:timestamptz;not null" json:"updatedAt"`
}

// TableName specifies the table name for Task
func (Task) TableName() string {
	return "tasks"
}
