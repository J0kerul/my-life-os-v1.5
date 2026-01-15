package http

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type CategoryHandler struct {
	categoryService interfaces.CategoryService
}

// NewCategoryHandler creates a new category handler
func NewCategoryHandler(categoryService interfaces.CategoryService) *CategoryHandler {
	return &CategoryHandler{
		categoryService: categoryService,
	}
}

// CreateCategoryRequest represents the request body for creating a category
type CreateCategoryRequest struct {
	Name string `json:"name"`
}

// UpdateCategoryRequest represents the request body for updating a category
type UpdateCategoryRequest struct {
	Name string `json:"name"`
}

// CreateCategory handles POST /api/categories
func (h *CategoryHandler) CreateCategory(c *fiber.Ctx) error {
	// Get user ID from context (set by auth middleware)
	userID := c.Locals("userID").(uuid.UUID)

	// Parse request body
	var req CreateCategoryRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate required fields
	if req.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Name is required",
		})
	}

	// Create category
	category, err := h.categoryService.CreateCategory(userID, req.Name)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":  "Category created successfully",
		"category": category,
	})
}

// GetCategories handles GET /api/categories
func (h *CategoryHandler) GetCategories(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Get categories
	categories, err := h.categoryService.GetUserCategories(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve categories",
		})
	}

	return c.JSON(fiber.Map{
		"categories": categories,
	})
}

// GetCategory handles GET /api/categories/:id
func (h *CategoryHandler) GetCategory(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse category ID
	categoryID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category ID",
		})
	}

	// Get category
	category, err := h.categoryService.GetCategory(categoryID, userID)
	if err != nil {
		if err.Error() == "unauthorized: category does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Category not found",
		})
	}

	return c.JSON(fiber.Map{
		"category": category,
	})
}

// UpdateCategory handles PUT /api/categories/:id
func (h *CategoryHandler) UpdateCategory(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse category ID
	categoryID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category ID",
		})
	}

	// Parse request body
	var req UpdateCategoryRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Update category
	category, err := h.categoryService.UpdateCategory(categoryID, userID, req.Name)
	if err != nil {
		if err.Error() == "unauthorized: category does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message":  "Category updated successfully",
		"category": category,
	})
}

// DeleteCategory handles DELETE /api/categories/:id
func (h *CategoryHandler) DeleteCategory(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse category ID
	categoryID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category ID",
		})
	}

	// Delete category
	err = h.categoryService.DeleteCategory(categoryID, userID)
	if err != nil {
		if err.Error() == "unauthorized: category does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Category deleted successfully",
	})
}
