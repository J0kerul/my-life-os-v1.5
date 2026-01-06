package interfaces

import (
	"github.com/google/uuid"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
)

// TaskRepository defines methods for task data access.
type TaskRepository interface {
	// CreateTask adds a new task to the database.
	CreateTask(task *entities.Task) error

	// FindTaskByID retrieves a task by its ID.
	FindTaskByID(taskID uuid.UUID) (*entities.Task, error)

	// FindByUserIDAndFilters retrieves tasks with filters
	FindTaskByUserIDAndFilters(userID uuid.UUID, filters map[string]any) ([]*entities.Task, error)

	// UpdateTask modifies an existing task.
	UpdateTask(task *entities.Task) error

	UpdateStatus(taskID uuid.UUID, status string) error

	// DeleteTask removes a task from the database.
	DeleteTask(taskID uuid.UUID) error
}
