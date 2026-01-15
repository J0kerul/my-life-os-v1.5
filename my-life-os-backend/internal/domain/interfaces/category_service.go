package interfaces

import (
	"github.com/google/uuid"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
)

// CategoryService defines the interface for category management business logic.
type CategoryService interface {
	// CreateCategory creates a new category for a user.
	CreateCategory(userID uuid.UUID, name string) (*entities.Category, error)

	// GetCategory retrieves a single category by its ID for a user.
	GetCategory(categoryID, userID uuid.UUID) (*entities.Category, error)

	// GetUserCategories retrieves all categories for a user.
	GetUserCategories(userID uuid.UUID) ([]*entities.Category, error)

	// UpdateCategory updates an existing category for a user.
	UpdateCategory(categoryID, userID uuid.UUID, name string) (*entities.Category, error)

	// DeleteCategory removes a category by its ID for a user.
	DeleteCategory(categoryID, userID uuid.UUID) error
}
