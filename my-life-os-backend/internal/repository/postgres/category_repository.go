package postgres

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type categoryRepository struct {
	db *gorm.DB
}

// NewCategoryRepository creates a new category repository
func NewCategoryRepository(db *gorm.DB) interfaces.CategoryRepository {
	return &categoryRepository{db: db}
}

// CreateCategory creates a new category
func (r *categoryRepository) CreateCategory(category *entities.Category) error {
	return r.db.Create(category).Error
}

// FindCategoryByID retrieves a category by ID
func (r *categoryRepository) FindCategoryByID(id uuid.UUID) (*entities.Category, error) {
	var category entities.Category
	err := r.db.Where("id = ?", id).First(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

// FindCategoriesByUserID retrieves all categories for a user
func (r *categoryRepository) FindCategoriesByUserID(userID uuid.UUID) ([]*entities.Category, error) {
	var categories []*entities.Category
	err := r.db.Where("user_id = ?", userID).Order("name ASC").Find(&categories).Error
	if err != nil {
		return nil, err
	}
	return categories, nil
}

// UpdateCategory updates a category
func (r *categoryRepository) UpdateCategory(category *entities.Category) error {
	return r.db.Save(category).Error
}

// DeleteCategory deletes a category
func (r *categoryRepository) DeleteCategory(id uuid.UUID) error {
	return r.db.Delete(&entities.Category{}, id).Error
}
