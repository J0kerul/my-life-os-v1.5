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

	// Run migrations (All entities)
	if err := database.AutoMigrate(db,
		&entities.User{},
		&entities.RefreshToken{},
		&entities.Task{},
		&entities.Routine{},
		&entities.RoutineCompletion{},
		&entities.Event{},
		&entities.EventException{},
		&entities.Category{},
		&entities.TechStackItem{},
		&entities.Project{},
		&entities.ProjectTask{},
	); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	// Initialize Repositories (Data Layer)
	userRepo := postgres.NewUserRepository(db)
	tokenRepo := postgres.NewTokenRepository(db)
	taskRepo := postgres.NewTaskRepository(db)
	routineRepo := postgres.NewRoutineRepository(db)
	eventRepo := postgres.NewEventRepository(db)
	categoryRepo := postgres.NewCategoryRepository(db)
	techStackRepo := postgres.NewTechStackItemRepository(db)
	projectRepo := postgres.NewProjectRepository(db)

	// Initialize Services (Business Logic Layer)
	authService := service.NewAuthService(userRepo, tokenRepo, cfg.JWTSecret)
	taskService := service.NewTaskService(taskRepo)
	routineService := service.NewRoutineService(routineRepo)
	eventService := service.NewEventService(eventRepo)
	categoryService := service.NewCategoryService(categoryRepo, techStackRepo)
	techStackService := service.NewTechStackService(techStackRepo, categoryRepo)
	projectService := service.NewProjectService(projectRepo, taskRepo)

	// Initialize Handlers (HTTP Layer)
	isDev := cfg.Environment == "development"
	authHdl := authHandler.NewAuthHandler(authService, isDev)
	taskHdl := authHandler.NewTaskHandler(taskService)
	routineHdl := authHandler.NewRoutineHandler(routineService)
	eventHdl := authHandler.NewEventHandler(eventService)
	categoryHdl := authHandler.NewCategoryHandler(categoryService)
	techStackHdl := authHandler.NewTechStackHandler(techStackService)
	projectHdl := authHandler.NewProjectHandler(projectService)

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

	// Routine routes (protected - require authentication)
	routines := api.Group("/routines", middleware.AuthMiddleware(authService), middleware.APIRateLimiter())
	routines.Get("/", routineHdl.GetRoutines)                   // GET /api/routines (with optional ?frequency=Daily)
	routines.Get("/today", routineHdl.GetTodaysRoutines)        // GET /api/routines/today
	routines.Post("/", routineHdl.CreateRoutine)                // POST /api/routines
	routines.Get("/:id", routineHdl.GetRoutine)                 // GET /api/routines/:id
	routines.Put("/:id", routineHdl.UpdateRoutine)              // PUT /api/routines/:id
	routines.Patch("/:id/complete", routineHdl.CompleteRoutine) // PATCH /api/routines/:id/complete
	routines.Patch("/:id/skip", routineHdl.SkipRoutine)         // PATCH /api/routines/:id/skip
	routines.Delete("/:id", routineHdl.DeleteRoutine)           // DELETE /api/routines/:id

	// Event routes (protected - require authentication)
	events := api.Group("/events", middleware.AuthMiddleware(authService), middleware.APIRateLimiter())
	events.Get("/", eventHdl.GetEvents)         // GET /api/events?start=...&end=...
	events.Post("/", eventHdl.CreateEvent)      // POST /api/events
	events.Get("/:id", eventHdl.GetEvent)       // GET /api/events/:id
	events.Put("/:id", eventHdl.UpdateEvent)    // PUT /api/events/:id
	events.Delete("/:id", eventHdl.DeleteEvent) // DELETE /api/events/:id (requires body with deleteScope)

	// Category routes (protected - require authentication)
	categories := api.Group("/categories", middleware.AuthMiddleware(authService), middleware.APIRateLimiter())
	categories.Get("/", categoryHdl.GetCategories)        // GET /api/categories
	categories.Post("/", categoryHdl.CreateCategory)      // POST /api/categories
	categories.Get("/:id", categoryHdl.GetCategory)       // GET /api/categories/:id
	categories.Put("/:id", categoryHdl.UpdateCategory)    // PUT /api/categories/:id
	categories.Delete("/:id", categoryHdl.DeleteCategory) // DELETE /api/categories/:id

	// Tech Stack routes (protected - require authentication)
	techStack := api.Group("/tech-stack", middleware.AuthMiddleware(authService), middleware.APIRateLimiter())
	techStack.Get("/", techStackHdl.GetTechStackItems)         // GET /api/tech-stack (with optional ?categoryId=...)
	techStack.Post("/", techStackHdl.CreateTechStackItem)      // POST /api/tech-stack
	techStack.Get("/:id", techStackHdl.GetTechStackItem)       // GET /api/tech-stack/:id
	techStack.Put("/:id", techStackHdl.UpdateTechStackItem)    // PUT /api/tech-stack/:id
	techStack.Delete("/:id", techStackHdl.DeleteTechStackItem) // DELETE /api/tech-stack/:id

	// Project routes (protected - require authentication)
	projects := api.Group("/projects", middleware.AuthMiddleware(authService), middleware.APIRateLimiter())
	projects.Get("/", projectHdl.GetProjects)                      // GET /api/projects (with optional ?status=...&techStackIds=...)
	projects.Post("/", projectHdl.CreateProject)                   // POST /api/projects
	projects.Get("/:id", projectHdl.GetProject)                    // GET /api/projects/:id
	projects.Put("/:id", projectHdl.UpdateProject)                 // PUT /api/projects/:id
	projects.Delete("/:id", projectHdl.DeleteProject)              // DELETE /api/projects/:id
	projects.Post("/:id/tasks", projectHdl.AssignTask)             // POST /api/projects/:id/tasks
	projects.Delete("/:id/tasks/:taskId", projectHdl.UnassignTask) // DELETE /api/projects/:id/tasks/:taskId
	projects.Get("/:id/tasks", projectHdl.GetProjectTasks)         // GET /api/projects/:id/tasks

	// Start server
	log.Printf("Server starting on port %s", cfg.Port)
	log.Printf("Environment: %s", cfg.Environment)
	log.Printf("JWT Secret: %s... (hidden)", cfg.JWTSecret[:10])

	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
