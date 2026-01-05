package middleware

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

type RateLimitConfig struct {
	Max        int
	Expiration time.Duration
}

// AuthRateLimiter creates a rate limiter for authentication endpoints (login, setup)
// Limits to 5 requests per 15 minutes per IP
func AuthRateLimiter() fiber.Handler {
	return limiter.New(limiter.Config{
		Max:        5,                // 5 attempts
		Expiration: 15 * time.Minute, // per 15 minutes
		KeyGenerator: func(c *fiber.Ctx) string {
			// Rate limit by IP address
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Too many requests. Please try again later.",
			})
		},
		// Store in-memory (for production, use Redis)
		Storage: nil, // nil = in-memory storage
	})
}

// RefreshRateLimiter creates a rate limiter for token refresh endpoint
// More lenient: 10 requests per 15 minutes per IP
func RefreshRateLimiter() fiber.Handler {
	return limiter.New(limiter.Config{
		Max:        10,               // 10 attempts
		Expiration: 15 * time.Minute, // per 15 minutes
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Too many refresh requests. Please try again later.",
			})
		},
		Storage: nil,
	})
}

// APIRateLimiter creates a general rate limiter for API endpoints
// 100 requests per minute per IP
func APIRateLimiter() fiber.Handler {
	return limiter.New(limiter.Config{
		Max:        100,         // 100 requests
		Expiration: time.Minute, // per minute
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Rate limit exceeded. Please slow down.",
			})
		},
		Storage: nil,
	})
}
