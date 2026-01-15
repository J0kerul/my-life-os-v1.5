package entities

import (
	"time"

	"github.com/google/uuid"
)

// Category represents a custom category for tech stack items
type Category struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;index" json:"userId"`
	Name      string    `gorm:"type:text;not null" json:"name"`
	CreatedAt time.Time `gorm:"type:timestamptz;not null" json:"createdAt"`

	// Relation
	TechStackItems []TechStackItem `gorm:"foreignKey:CategoryID" json:"-"`
}

// TableName specifies the table name for GORM
func (Category) TableName() string {
	return "categories"
}
