package http

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
)

// AuthHandler handles authentication-related HTTP requests
type AuthHandler struct {
	authService interfaces.AuthService
	isDev       bool // For cookie secure flag
}

// NewAuthHandler creates a new AuthHandler instance
func NewAuthHandler(authService interfaces.AuthService, isDev bool) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		isDev:       isDev,
	}
}

// Request/Response DTOs
type SetupRequest struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type UserResponse struct {
	ID       uuid.UUID `json:"id"`
	Email    string    `json:"email"`
	Name     string    `json:"name"`
	Timezone string    `json:"timezone,omitempty"`
}

// GetStatus checks if the application needs setup
// GET /api/status
func (h *AuthHandler) GetStatus(c *fiber.Ctx) error {
	needsSetup, err := h.authService.NeedsSetup()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to check setup status",
		})
	}

	return c.JSON(fiber.Map{
		"needsSetup": needsSetup,
		"version":    "1.5.0",
	})
}

// Setup creates the initial user account
// POST /api/setup
func (h *AuthHandler) Setup(c *fiber.Ctx) error {
	var req SetupRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Register user and get tokens
	user, tokens, err := h.authService.Register(req.Name, req.Email, req.Password)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Set tokens as HttpOnly cookies
	h.setAuthCookies(c, tokens.AccessToken, tokens.RefreshToken)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Account created successfully",
		"user": UserResponse{
			ID:       user.ID,
			Email:    user.Email,
			Name:     user.Name,
			Timezone: user.Timezone,
		},
	})
}

// Login authenticates a user
// POST /api/auth/login
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Authenticate user
	user, tokens, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Set tokens as HttpOnly cookies
	h.setAuthCookies(c, tokens.AccessToken, tokens.RefreshToken)

	return c.JSON(fiber.Map{
		"message": "Login successful",
		"user": UserResponse{
			ID:       user.ID,
			Email:    user.Email,
			Name:     user.Name,
			Timezone: user.Timezone,
		},
	})
}

// Refresh generates new tokens using refresh token
// POST /api/auth/refresh
func (h *AuthHandler) Refresh(c *fiber.Ctx) error {
	// Get refresh token from cookie
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "No refresh token provided",
		})
	}

	// Generate new tokens
	tokens, err := h.authService.RefreshTokens(refreshToken)
	if err != nil {
		// Clear invalid cookies
		h.clearAuthCookies(c)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Set new tokens as HttpOnly cookies
	h.setAuthCookies(c, tokens.AccessToken, tokens.RefreshToken)

	return c.JSON(fiber.Map{
		"message": "Tokens refreshed successfully",
	})
}

// Logout invalidates the user's refresh tokens
// POST /api/auth/logout
func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	// Get user ID from context (set by auth middleware)
	userID := c.Locals("userID")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	// Logout user (invalidate all refresh tokens)
	if err := h.authService.Logout(userID.(uuid.UUID)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to logout",
		})
	}

	// Clear cookies
	h.clearAuthCookies(c)

	return c.JSON(fiber.Map{
		"message": "Logout successful",
	})
}

// GetMe returns the current authenticated user
// GET /api/auth/me
func (h *AuthHandler) GetMe(c *fiber.Ctx) error {
	// Get user ID from context (set by auth middleware)
	userID := c.Locals("userID")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	// This is a placeholder - in a real app, you'd fetch the full user from database
	// For now, we just return what we have
	return c.JSON(fiber.Map{
		"id": userID.(uuid.UUID),
	})
}

// Helper: Set auth cookies (HttpOnly, Secure in production, SameSite Lax)
func (h *AuthHandler) setAuthCookies(c *fiber.Ctx, accessToken, refreshToken string) {
	// Access Token Cookie (15 minutes)
	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Expires:  time.Now().Add(15 * time.Minute),
		HTTPOnly: true,
		Secure:   !h.isDev, // true in production, false in development
		SameSite: "Lax",
		Path:     "/",
	})

	// Refresh Token Cookie (7 days)
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Expires:  time.Now().Add(7 * 24 * time.Hour),
		HTTPOnly: true,
		Secure:   !h.isDev, // true in production, false in development
		SameSite: "Lax",
		Path:     "/",
	})
}

// Helper: Clear auth cookies
func (h *AuthHandler) clearAuthCookies(c *fiber.Ctx) {
	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HTTPOnly: true,
		Secure:   !h.isDev,
		SameSite: "Lax",
		Path:     "/",
	})

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HTTPOnly: true,
		Secure:   !h.isDev,
		SameSite: "Lax",
		Path:     "/",
	})
}
