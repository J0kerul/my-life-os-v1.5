package service

import (
	"errors"
	"time"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"

	"github.com/google/uuid"
)

type categoryService struct {
	categoryRepo      interfaces.CategoryRepository
	techStackItemRepo interfaces.TechStackItemRepository
}

// NewCategoryService creates a new category service
func NewCategoryService(categoryRepo interfaces.CategoryRepository, techStackItemRepo interfaces.TechStackItemRepository) interfaces.CategoryService {
	return &categoryService{
		categoryRepo:      categoryRepo,
		techStackItemRepo: techStackItemRepo,
	}
}

// CreateCategory creates a new category
func (s *categoryService) CreateCategory(userID uuid.UUID, name string) (*entities.Category, error) {
	// Validate required fields
	if name == "" {
		return nil, errors.New("name is required")
	}

	// Create category
	category := &entities.Category{
		ID:        uuid.New(),
		UserID:    userID,
		Name:      name,
		CreatedAt: time.Now(),
	}

	err := s.categoryRepo.CreateCategory(category)
	if err != nil {
		return nil, err
	}

	return category, nil
}

// GetCategory retrieves a single category (ensures user owns it)
func (s *categoryService) GetCategory(categoryID, userID uuid.UUID) (*entities.Category, error) {
	category, err := s.categoryRepo.FindCategoryByID(categoryID)
	if err != nil {
		return nil, err
	}

	// Verify ownership
	if category.UserID != userID {
		return nil, errors.New("unauthorized: category does not belong to user")
	}

	return category, nil
}

// GetUserCategories retrieves all categories for a user
func (s *categoryService) GetUserCategories(userID uuid.UUID) ([]*entities.Category, error) {
	return s.categoryRepo.FindCategoriesByUserID(userID)
}

// UpdateCategory updates a category
func (s *categoryService) UpdateCategory(categoryID, userID uuid.UUID, name string) (*entities.Category, error) {
	// Get category and verify ownership
	category, err := s.GetCategory(categoryID, userID)
	if err != nil {
		return nil, err
	}

	// Validate required fields
	if name == "" {
		return nil, errors.New("name is required")
	}

	// Update fields
	category.Name = name

	err = s.categoryRepo.UpdateCategory(category)
	if err != nil {
		return nil, err
	}

	return category, nil
}

// DeleteCategory deletes a category
func (s *categoryService) DeleteCategory(categoryID, userID uuid.UUID) error {
	// Verify ownership first
	_, err := s.GetCategory(categoryID, userID)
	if err != nil {
		return err
	}

	// Check if category has tech stack items
	items, err := s.techStackItemRepo.FindTechStackItemsByCategoryID(categoryID)
	if err != nil {
		return err
	}

	if len(items) > 0 {
		return errors.New("cannot delete category with existing tech stack items")
	}

	return s.categoryRepo.DeleteCategory(categoryID)
}
