package interfaces

import (
	"github.com/google/uuid"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
)

// ProjectService defines the interface for project management business logic.
type ProjectService interface {
	// CreateProject creates a new project for a user.
	CreateProject(userID uuid.UUID, title, description string, status string, repositoryURL string, techStackIDs []uuid.UUID) (*entities.Project, error)

	// GetProject retrieves a single project by its ID for a user.
	GetProject(projectID, userID uuid.UUID) (*entities.Project, error)

	// GetUserProjects retrieves all projects for a user.
	GetUserProjects(userID uuid.UUID) ([]*entities.Project, error)

	// GetProjectsWithFilters retrieves projects with filters for a user.
	GetProjectsWithFilters(userID uuid.UUID, status string, techStackIDs []uuid.UUID) ([]*entities.Project, error)

	// UpdateProject updates an existing project for a user.
	UpdateProject(projectID, userID uuid.UUID, title, description string, status string, repositoryURL string, techStackIDs []uuid.UUID) (*entities.Project, error)

	// DeleteProject removes a project by its ID for a user.
	DeleteProject(projectID, userID uuid.UUID) error

	// AssignTaskToProject assigns a task to a project for a user.
	AssignTaskToProject(projectID, taskID, userID uuid.UUID) error

	// UnassignTaskFromProject removes a task assignment from a project for a user.
	UnassignTaskFromProject(projectID, taskID, userID uuid.UUID) error

	// GetProjectTasks retrieves all tasks assigned to a project for a user.
	GetProjectTasks(projectID, userID uuid.UUID) ([]*entities.ProjectTask, error)

	// CalculateProgress calculates the completion percentage of a project.
	CalculateProgress(projectID uuid.UUID) (float64, error)
}
