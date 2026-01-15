package interfaces

import (
	"github.com/google/uuid"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
)

// ProjectRepository defines methods for project data access.
type ProjectRepository interface {
	// CreateProject adds a new project to the database.
	CreateProject(project *entities.Project) error

	// FindProjectByID retrieves a project by its ID.
	FindProjectByID(projectID uuid.UUID) (*entities.Project, error)

	// FindProjectsByUserID retrieves all projects for a user.
	FindProjectsByUserID(userID uuid.UUID) ([]*entities.Project, error)

	// FindProjectsByUserIDAndFilters retrieves projects with filters.
	FindProjectsByUserIDAndFilters(userID uuid.UUID, status string, techStackIDs []uuid.UUID) ([]*entities.Project, error)

	// UpdateProject modifies an existing project.
	UpdateProject(project *entities.Project) error

	// DeleteProject removes a project from the database.
	DeleteProject(projectID uuid.UUID) error

	// AssignTask assigns a task to a project.
	AssignTask(projectTask *entities.ProjectTask) error

	// UnassignTask removes a task assignment from a project.
	UnassignTask(projectID, taskID uuid.UUID) error

	// FindProjectTasks retrieves all tasks assigned to a project.
	FindProjectTasks(projectID uuid.UUID) ([]*entities.ProjectTask, error)
}
