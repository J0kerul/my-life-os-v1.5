package interfaces

import (
	"github.com/google/uuid"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
)

// CategoryRepository defines methods for category data access.
type CategoryRepository interface {
	// CreateCategory adds a new category to the database.
	CreateCategory(category *entities.Category) error

	// FindCategoryByID retrieves a category by its ID.
	FindCategoryByID(categoryID uuid.UUID) (*entities.Category, error)

	// FindCategoriesByUserID retrieves all categories for a user.
	FindCategoriesByUserID(userID uuid.UUID) ([]*entities.Category, error)

	// UpdateCategory modifies an existing category.
	UpdateCategory(category *entities.Category) error

	// DeleteCategory removes a category from the database.
	DeleteCategory(categoryID uuid.UUID) error
}
