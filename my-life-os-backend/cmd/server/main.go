package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/config"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/database"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	authHandler "github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/handler/http"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/middleware"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/repository/postgres"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/service"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Connect to database
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Run migrations (User + RefreshToken + Task + Routine)
	if err := database.AutoMigrate(db, &entities.User{}, &entities.RefreshToken{}, &entities.Task{}, &entities.Routine{}); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	// Initialize Repositories (Data Layer)
	userRepo := postgres.NewUserRepository(db)
	tokenRepo := postgres.NewTokenRepository(db)
	taskRepo := postgres.NewTaskRepository(db)

	// Initialize Services (Business Logic Layer)
	authService := service.NewAuthService(userRepo, tokenRepo, cfg.JWTSecret)
	taskService := service.NewTaskService(taskRepo)

	// Initialize Handlers (HTTP Layer)
	isDev := cfg.Environment == "development"
	authHdl := authHandler.NewAuthHandler(authService, isDev)
	taskHdl := authHandler.NewTaskHandler(taskService)

	// Initialize Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"error": err.Error(),
			})
		},
	})

	// Global Middleware
	app.Use(recover.New()) // Recover from panics
	app.Use(logger.New())  // Request logging
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.AllowedOrigins,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, PATCH, DELETE, OPTIONS",
		AllowCredentials: true, // Important for cookies!
	}))

	// Health check route
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "Backend is running",
		})
	})

	// API routes
	api := app.Group("/api")

	// Public routes (no auth required)
	api.Get("/status", authHdl.GetStatus)
	api.Post("/setup", middleware.AuthRateLimiter(), authHdl.Setup)

	// Auth routes
	auth := api.Group("/auth")
	auth.Post("/login", middleware.AuthRateLimiter(), authHdl.Login)
	auth.Post("/refresh", middleware.RefreshRateLimiter(), authHdl.Refresh)

	// Protected auth routes (require valid access token)
	auth.Post("/logout", middleware.AuthMiddleware(authService), authHdl.Logout)
	auth.Get("/me", middleware.AuthMiddleware(authService), authHdl.GetMe)

	// Task routes (protected - require authentication)
	tasks := api.Group("/tasks", middleware.AuthMiddleware(authService), middleware.APIRateLimiter())
	tasks.Get("/", taskHdl.GetTasks)                     // GET /api/tasks (with optional filters)
	tasks.Post("/", taskHdl.CreateTask)                  // POST /api/tasks
	tasks.Get("/:id", taskHdl.GetTask)                   // GET /api/tasks/:id
	tasks.Put("/:id", taskHdl.UpdateTask)                // PUT /api/tasks/:id
	tasks.Patch("/:id/status", taskHdl.ToggleTaskStatus) // PATCH /api/tasks/:id/status
	tasks.Delete("/:id", taskHdl.DeleteTask)             // DELETE /api/tasks/:id

	// Start server
	log.Printf("Server starting on port %s", cfg.Port)
	log.Printf("Environment: %s", cfg.Environment)
	log.Printf("JWT Secret: %s... (hidden)", cfg.JWTSecret[:10])

	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
