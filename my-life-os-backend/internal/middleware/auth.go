package middleware

import (
	"github.com/gofiber/fiber/v2"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
)

// AuthMiddleware creates a middleware that verifies JWT access tokens from cookies
func AuthMiddleware(authService interfaces.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get access token from HttpOnly cookie
		accessToken := c.Cookies("access_token")
		if accessToken == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Access token is missing",
			})
		}

		// Validate access token
		userID, err := authService.ValidateAccessToken(accessToken)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid or expired access token",
			})
		}

		// Store user ID in context for handlers to use
		c.Locals("userID", userID)

		// Continue to next handler
		return c.Next()
	}
}

// OptionalAuthMiddleware is like AuthMiddleware but does not fail if no token is present
// Useful for endpoints that can be accessed by both authenticated and unauthenticated users
func OptionalAuthMiddleware(authService interfaces.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get access token from HttpOnly cookie
		accessToken := c.Cookies("access_token")
		if accessToken == "" {
			// No token, continue without setting userID
			return c.Next()
		}

		// Validate access token
		userID, err := authService.ValidateAccessToken(accessToken)
		if err != nil {
			// Invalid token, continue without setting userID
			return c.Next()
		}

		// Store user ID in context
		c.Locals("userID", userID)

		return c.Next()
	}
}
