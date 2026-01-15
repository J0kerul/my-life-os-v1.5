package entities

import (
	"time"

	"github.com/google/uuid"
)

// ProjectTask represents the relationship between a project and a task
type ProjectTask struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	ProjectID  uuid.UUID `gorm:"type:uuid;not null;index" json:"projectId"`
	TaskID     uuid.UUID `gorm:"type:uuid;not null;index" json:"taskId"`
	AssignedAt time.Time `gorm:"type:timestamptz;not null" json:"assignedAt"`

	// Relations
	Project Project `gorm:"foreignKey:ProjectID" json:"-"`
	Task    Task    `gorm:"foreignKey:TaskID" json:"task"`
}

// TableName specifies the table name for GORM
func (ProjectTask) TableName() string {
	return "project_tasks"
}
