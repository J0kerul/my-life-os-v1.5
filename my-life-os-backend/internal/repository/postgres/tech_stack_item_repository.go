package postgres

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type techStackItemRepository struct {
	db *gorm.DB
}

// NewTechStackItemRepository creates a new tech stack item repository
func NewTechStackItemRepository(db *gorm.DB) interfaces.TechStackItemRepository {
	return &techStackItemRepository{db: db}
}

// CreateTechStackItem creates a new tech stack item
func (r *techStackItemRepository) CreateTechStackItem(item *entities.TechStackItem) error {
	return r.db.Create(item).Error
}

// FindTechStackItemByID retrieves a tech stack item by ID
func (r *techStackItemRepository) FindTechStackItemByID(id uuid.UUID) (*entities.TechStackItem, error) {
	var item entities.TechStackItem
	err := r.db.Preload("Category").Where("id = ?", id).First(&item).Error
	if err != nil {
		return nil, err
	}
	return &item, nil
}

// FindTechStackItemsByUserID retrieves all tech stack items for a user
func (r *techStackItemRepository) FindTechStackItemsByUserID(userID uuid.UUID) ([]*entities.TechStackItem, error) {
	var items []*entities.TechStackItem
	err := r.db.Preload("Category").Where("user_id = ?", userID).Order("name ASC").Find(&items).Error
	if err != nil {
		return nil, err
	}
	return items, nil
}

// FindTechStackItemsByCategoryID retrieves all tech stack items in a category
func (r *techStackItemRepository) FindTechStackItemsByCategoryID(categoryID uuid.UUID) ([]*entities.TechStackItem, error) {
	var items []*entities.TechStackItem
	err := r.db.Preload("Category").Where("category_id = ?", categoryID).Order("name ASC").Find(&items).Error
	if err != nil {
		return nil, err
	}
	return items, nil
}

// UpdateTechStackItem updates a tech stack item
func (r *techStackItemRepository) UpdateTechStackItem(item *entities.TechStackItem) error {
	return r.db.Save(item).Error
}

// DeleteTechStackItem deletes a tech stack item
func (r *techStackItemRepository) DeleteTechStackItem(id uuid.UUID) error {
	return r.db.Delete(&entities.TechStackItem{}, id).Error
}
