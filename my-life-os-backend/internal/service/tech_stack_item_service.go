package service

import (
	"errors"
	"time"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
	"github.com/google/uuid"
)

type techStackService struct {
	techStackRepo interfaces.TechStackItemRepository
	categoryRepo  interfaces.CategoryRepository
}

// NewTechStackService creates a new tech stack service
func NewTechStackService(techStackRepo interfaces.TechStackItemRepository, categoryRepo interfaces.CategoryRepository) interfaces.TechStackService {
	return &techStackService{
		techStackRepo: techStackRepo,
		categoryRepo:  categoryRepo,
	}
}

// CreateTechStackItem creates a new tech stack item
func (s *techStackService) CreateTechStackItem(userID uuid.UUID, categoryID uuid.UUID, name string) (*entities.TechStackItem, error) {
	// Validate required fields
	if name == "" {
		return nil, errors.New("name is required")
	}

	// Verify category exists and belongs to user
	category, err := s.categoryRepo.FindCategoryByID(categoryID)
	if err != nil {
		return nil, errors.New("category not found")
	}
	if category.UserID != userID {
		return nil, errors.New("unauthorized: category does not belong to user")
	}

	// Create tech stack item
	item := &entities.TechStackItem{
		ID:         uuid.New(),
		UserID:     userID,
		CategoryID: categoryID,
		Name:       name,
		CreatedAt:  time.Now(),
	}

	err = s.techStackRepo.CreateTechStackItem(item)
	if err != nil {
		return nil, err
	}

	// Reload to get category relation
	return s.techStackRepo.FindTechStackItemByID(item.ID)
}

// GetTechStackItem retrieves a single tech stack item (ensures user owns it)
func (s *techStackService) GetTechStackItem(itemID, userID uuid.UUID) (*entities.TechStackItem, error) {
	item, err := s.techStackRepo.FindTechStackItemByID(itemID)
	if err != nil {
		return nil, err
	}

	// Verify ownership
	if item.UserID != userID {
		return nil, errors.New("unauthorized: tech stack item does not belong to user")
	}

	return item, nil
}

// GetUserTechStack retrieves all tech stack items for a user
func (s *techStackService) GetUserTechStack(userID uuid.UUID) ([]*entities.TechStackItem, error) {
	return s.techStackRepo.FindTechStackItemsByUserID(userID)
}

// GetTechStackByCategory retrieves all tech stack items in a category for a user
func (s *techStackService) GetTechStackByCategory(categoryID, userID uuid.UUID) ([]*entities.TechStackItem, error) {
	// Verify category belongs to user
	category, err := s.categoryRepo.FindCategoryByID(categoryID)
	if err != nil {
		return nil, err
	}
	if category.UserID != userID {
		return nil, errors.New("unauthorized: category does not belong to user")
	}

	return s.techStackRepo.FindTechStackItemsByCategoryID(categoryID)
}

// UpdateTechStackItem updates a tech stack item
func (s *techStackService) UpdateTechStackItem(itemID, userID uuid.UUID, categoryID uuid.UUID, name string) (*entities.TechStackItem, error) {
	// Get item and verify ownership
	item, err := s.GetTechStackItem(itemID, userID)
	if err != nil {
		return nil, err
	}

	// Validate required fields
	if name == "" {
		return nil, errors.New("name is required")
	}

	// Verify new category exists and belongs to user
	category, err := s.categoryRepo.FindCategoryByID(categoryID)
	if err != nil {
		return nil, errors.New("category not found")
	}
	if category.UserID != userID {
		return nil, errors.New("unauthorized: category does not belong to user")
	}

	// Update fields
	item.Name = name
	item.CategoryID = categoryID

	err = s.techStackRepo.UpdateTechStackItem(item)
	if err != nil {
		return nil, err
	}

	// Reload to get updated category relation
	return s.techStackRepo.FindTechStackItemByID(itemID)
}

// DeleteTechStackItem deletes a tech stack item
func (s *techStackService) DeleteTechStackItem(itemID, userID uuid.UUID) error {
	// Verify ownership first
	_, err := s.GetTechStackItem(itemID, userID)
	if err != nil {
		return err
	}

	return s.techStackRepo.DeleteTechStackItem(itemID)
}
