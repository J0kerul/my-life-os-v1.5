package interfaces

import (
	"github.com/google/uuid"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
)

// TaskService defines the interface for task management business logic.
type TaskService interface {
	// CreateTask creates a new task for a user
	CreateTask(userID uuid.UUID, title, description, priority, domain string, deadline *string) (*entities.Task, error)

	// GetTask retrieves a single task by its ID for a user
	GetTask(taskID, userID uuid.UUID) (*entities.Task, error)

	// GetUserTasks retrieves all tasks for a user
	GetUserTasks(userID uuid.UUID) ([]*entities.Task, error)

	GetUserTasksWithFilters(userID uuid.UUID, domain, status, timeFilter string) ([]*entities.Task, error)

	// UpdateTask updates an existing task for a user
	UpdateTask(taskID, userID uuid.UUID, title, description, priority, domain string, deadline *string) (*entities.Task, error)

	// ToggleTaskStatus toggles the completion status of a task for a user
	ToggleTaskStatus(taskID, userID uuid.UUID) (*entities.Task, error)

	// DeleteTask removes a task by its ID for a user
	DeleteTask(taskID, userID uuid.UUID) error
}
