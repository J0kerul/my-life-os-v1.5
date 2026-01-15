package entities

import (
	"time"

	"github.com/google/uuid"
)

// TechStackItem represents a technology that can be used in projects
type TechStackItem struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	UserID     uuid.UUID `gorm:"type:uuid;not null;index" json:"userId"`
	CategoryID uuid.UUID `gorm:"type:uuid;not null;index" json:"categoryId"`
	Name       string    `gorm:"type:text;not null" json:"name"`
	CreatedAt  time.Time `gorm:"type:timestamptz;not null" json:"createdAt"`

	// Relations
	Category Category  `gorm:"foreignKey:CategoryID" json:"category"`
	Projects []Project `gorm:"many2many:project_tech_stack;" json:"-"`
}

// TableName specifies the table name for GORM
func (TechStackItem) TableName() string {
	return "tech_stack_items"
}
