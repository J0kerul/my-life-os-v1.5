package postgres

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type projectRepository struct {
	db *gorm.DB
}

// NewProjectRepository creates a new project repository
func NewProjectRepository(db *gorm.DB) interfaces.ProjectRepository {
	return &projectRepository{db: db}
}

// CreateProject creates a new project
func (r *projectRepository) CreateProject(project *entities.Project) error {
	return r.db.Create(project).Error
}

// FindProjectByID retrieves a project by ID
func (r *projectRepository) FindProjectByID(id uuid.UUID) (*entities.Project, error) {
	var project entities.Project
	err := r.db.Preload("TechStack.Category").Preload("Tasks.Task").Where("id = ?", id).First(&project).Error
	if err != nil {
		return nil, err
	}
	return &project, nil
}

// FindProjectsByUserID retrieves all projects for a user
func (r *projectRepository) FindProjectsByUserID(userID uuid.UUID) ([]*entities.Project, error) {
	var projects []*entities.Project
	err := r.db.Preload("TechStack.Category").Preload("Tasks.Task").Where("user_id = ?", userID).Find(&projects).Error
	if err != nil {
		return nil, err
	}
	return projects, nil
}

// FindProjectsByUserIDAndFilters retrieves projects with filters
func (r *projectRepository) FindProjectsByUserIDAndFilters(userID uuid.UUID, status string, techStackIDs []uuid.UUID) ([]*entities.Project, error) {
	query := r.db.Preload("TechStack.Category").Preload("Tasks.Task").Where("user_id = ?", userID)

	// Apply status filter
	if status != "" {
		query = query.Where("status = ?", status)
	}

	// Apply tech stack filter
	if len(techStackIDs) > 0 {
		// Join with the many-to-many table to filter projects that have ALL selected tech stack items
		query = query.Joins("JOIN project_tech_stack ON projects.id = project_tech_stack.project_id").
			Where("project_tech_stack.tech_stack_item_id IN ?", techStackIDs).
			Group("projects.id").
			Having("COUNT(DISTINCT project_tech_stack.tech_stack_item_id) = ?", len(techStackIDs))
	}

	var projects []*entities.Project
	err := query.Find(&projects).Error
	if err != nil {
		return nil, err
	}

	return projects, nil
}

// UpdateProject updates a project
func (r *projectRepository) UpdateProject(project *entities.Project) error {
	// Update the project and replace the tech stack association
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Update basic fields
		if err := tx.Save(project).Error; err != nil {
			return err
		}

		// Replace tech stack association
		if err := tx.Model(project).Association("TechStack").Replace(project.TechStack); err != nil {
			return err
		}

		return nil
	})
}

// DeleteProject deletes a project
func (r *projectRepository) DeleteProject(id uuid.UUID) error {
	return r.db.Delete(&entities.Project{}, id).Error
}

// AssignTask assigns a task to a project
func (r *projectRepository) AssignTask(projectTask *entities.ProjectTask) error {
	return r.db.Create(projectTask).Error
}

// UnassignTask removes a task assignment from a project
func (r *projectRepository) UnassignTask(projectID, taskID uuid.UUID) error {
	return r.db.Where("project_id = ? AND task_id = ?", projectID, taskID).Delete(&entities.ProjectTask{}).Error
}

// FindProjectTasks retrieves all tasks assigned to a project
func (r *projectRepository) FindProjectTasks(projectID uuid.UUID) ([]*entities.ProjectTask, error) {
	var projectTasks []*entities.ProjectTask
	err := r.db.Preload("Task").Where("project_id = ?", projectID).Order("assigned_at DESC").Find(&projectTasks).Error
	if err != nil {
		return nil, err
	}
	return projectTasks, nil
}
