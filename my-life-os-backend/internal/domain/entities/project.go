package entities

import (
	"github.com/google/uuid"
)

// Project status values
const (
	StatusIdea      = "Idea"
	StatusPlanning  = "Planning"
	StatusActive    = "Active"
	StatusDebugging = "Debugging"
	StatusTesting   = "Testing"
	StatusOnHold    = "On Hold"
	StatusFinished  = "Finished"
	StatusAbandoned = "Abandoned"
)

// Project represents a user's project
type Project struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	UserID        uuid.UUID `gorm:"type:uuid;not null;index" json:"userId"`
	Title         string    `gorm:"type:text;not null" json:"title"`
	Description   string    `gorm:"type:text;not null" json:"description"`
	Status        string    `gorm:"type:text;not null;default:'Idea'" json:"status"`
	RepositoryURL string    `gorm:"type:text" json:"repositoryUrl,omitempty"`

	// Many-to-many relationships
	TechStack []TechStackItem `gorm:"many2many:project_tech_stack;" json:"techStack"`
	Tasks     []ProjectTask   `gorm:"foreignKey:ProjectID" json:"tasks"`
}

// TableName specifies the table name for GORM
func (Project) TableName() string {
	return "projects"
}

// GetProgress calculates the completion percentage based on assigned tasks
func (p *Project) GetProgress() float64 {
	if len(p.Tasks) == 0 {
		return 0.0
	}

	completedCount := 0
	for _, pt := range p.Tasks {
		// Check if the task is completed using the Task StatusDone constant
		if pt.Task.Status == StatusDone {
			completedCount++
		}
	}

	return float64(completedCount) / float64(len(p.Tasks)) * 100
}
