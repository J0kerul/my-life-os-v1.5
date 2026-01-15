package http

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type TechStackHandler struct {
	techStackService interfaces.TechStackService
}

// NewTechStackHandler creates a new tech stack handler
func NewTechStackHandler(techStackService interfaces.TechStackService) *TechStackHandler {
	return &TechStackHandler{
		techStackService: techStackService,
	}
}

// CreateTechStackItemRequest represents the request body for creating a tech stack item
type CreateTechStackItemRequest struct {
	CategoryID string `json:"categoryId"`
	Name       string `json:"name"`
}

// UpdateTechStackItemRequest represents the request body for updating a tech stack item
type UpdateTechStackItemRequest struct {
	CategoryID string `json:"categoryId"`
	Name       string `json:"name"`
}

// CreateTechStackItem handles POST /api/tech-stack
func (h *TechStackHandler) CreateTechStackItem(c *fiber.Ctx) error {
	// Get user ID from context (set by auth middleware)
	userID := c.Locals("userID").(uuid.UUID)

	// Parse request body
	var req CreateTechStackItemRequest
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

	if req.CategoryID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category ID is required",
		})
	}

	// Parse category ID
	categoryID, err := uuid.Parse(req.CategoryID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category ID format",
		})
	}

	// Create tech stack item
	item, err := h.techStackService.CreateTechStackItem(userID, categoryID, req.Name)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Tech stack item created successfully",
		"item":    item,
	})
}

// GetTechStackItems handles GET /api/tech-stack
func (h *TechStackHandler) GetTechStackItems(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Get query parameter for category filter
	categoryIDStr := c.Query("categoryId")

	// Get tech stack items
	var items []*entities.TechStackItem
	var err error

	if categoryIDStr != "" {
		categoryID, parseErr := uuid.Parse(categoryIDStr)
		if parseErr != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid category ID",
			})
		}
		items, err = h.techStackService.GetTechStackByCategory(categoryID, userID)
	} else {
		items, err = h.techStackService.GetUserTechStack(userID)
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve tech stack items",
		})
	}

	return c.JSON(fiber.Map{
		"items": items,
	})
}

// GetTechStackItem handles GET /api/tech-stack/:id
func (h *TechStackHandler) GetTechStackItem(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse item ID
	itemID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid item ID",
		})
	}

	// Get tech stack item
	item, err := h.techStackService.GetTechStackItem(itemID, userID)
	if err != nil {
		if err.Error() == "unauthorized: tech stack item does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Tech stack item not found",
		})
	}

	return c.JSON(fiber.Map{
		"item": item,
	})
}

// UpdateTechStackItem handles PUT /api/tech-stack/:id
func (h *TechStackHandler) UpdateTechStackItem(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse item ID
	itemID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid item ID",
		})
	}

	// Parse request body
	var req UpdateTechStackItemRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Parse category ID
	categoryID, err := uuid.Parse(req.CategoryID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category ID format",
		})
	}

	// Update tech stack item
	item, err := h.techStackService.UpdateTechStackItem(itemID, userID, categoryID, req.Name)
	if err != nil {
		if err.Error() == "unauthorized: tech stack item does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Tech stack item updated successfully",
		"item":    item,
	})
}

// DeleteTechStackItem handles DELETE /api/tech-stack/:id
func (h *TechStackHandler) DeleteTechStackItem(c *fiber.Ctx) error {
	// Get user ID from context
	userID := c.Locals("userID").(uuid.UUID)

	// Parse item ID
	itemID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid item ID",
		})
	}

	// Delete tech stack item
	err = h.techStackService.DeleteTechStackItem(itemID, userID)
	if err != nil {
		if err.Error() == "unauthorized: tech stack item does not belong to user" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Tech stack item deleted successfully",
	})
}
