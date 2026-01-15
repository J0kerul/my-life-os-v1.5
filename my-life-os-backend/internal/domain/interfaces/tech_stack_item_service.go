package interfaces

import (
	"github.com/google/uuid"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
)

// TechStackService defines the interface for tech stack management business logic.
type TechStackService interface {
	// CreateTechStackItem creates a new tech stack item for a user.
	CreateTechStackItem(userID uuid.UUID, categoryID uuid.UUID, name string) (*entities.TechStackItem, error)

	// GetTechStackItem retrieves a single tech stack item by its ID for a user.
	GetTechStackItem(itemID, userID uuid.UUID) (*entities.TechStackItem, error)

	// GetUserTechStack retrieves all tech stack items for a user.
	GetUserTechStack(userID uuid.UUID) ([]*entities.TechStackItem, error)

	// GetTechStackByCategory retrieves all tech stack items in a category for a user.
	GetTechStackByCategory(categoryID, userID uuid.UUID) ([]*entities.TechStackItem, error)

	// UpdateTechStackItem updates an existing tech stack item for a user.
	UpdateTechStackItem(itemID, userID uuid.UUID, categoryID uuid.UUID, name string) (*entities.TechStackItem, error)

	// DeleteTechStackItem removes a tech stack item by its ID for a user.
	DeleteTechStackItem(itemID, userID uuid.UUID) error
}
