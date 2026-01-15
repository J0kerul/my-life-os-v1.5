package interfaces

import (
	"github.com/google/uuid"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
)

// TechStackItemRepository defines methods for tech stack item data access.
type TechStackItemRepository interface {
	// CreateTechStackItem adds a new tech stack item to the database.
	CreateTechStackItem(item *entities.TechStackItem) error

	// FindTechStackItemByID retrieves a tech stack item by its ID.
	FindTechStackItemByID(itemID uuid.UUID) (*entities.TechStackItem, error)

	// FindTechStackItemsByUserID retrieves all tech stack items for a user.
	FindTechStackItemsByUserID(userID uuid.UUID) ([]*entities.TechStackItem, error)

	// FindTechStackItemsByCategoryID retrieves all tech stack items in a category.
	FindTechStackItemsByCategoryID(categoryID uuid.UUID) ([]*entities.TechStackItem, error)

	// UpdateTechStackItem modifies an existing tech stack item.
	UpdateTechStackItem(item *entities.TechStackItem) error

	// DeleteTechStackItem removes a tech stack item from the database.
	DeleteTechStackItem(itemID uuid.UUID) error
}
