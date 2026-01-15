package service

import (
	"errors"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"

	"time"

	"github.com/google/uuid"
)

type projectService struct {
	projectRepo interfaces.ProjectRepository
	taskRepo    interfaces.TaskRepository
}

// NewProjectService creates a new project service
func NewProjectService(projectRepo interfaces.ProjectRepository, taskRepo interfaces.TaskRepository) interfaces.ProjectService {
	return &projectService{
		projectRepo: projectRepo,
		taskRepo:    taskRepo,
	}
}

// CreateProject creates a new project
func (s *projectService) CreateProject(userID uuid.UUID, title, description string, status string, repositoryURL string, techStackIDs []uuid.UUID) (*entities.Project, error) {
	// Validate required fields
	if title == "" {
		return nil, errors.New("title is required")
	}
	if description == "" {
		return nil, errors.New("description is required")
	}

	// Validate status
	validStatuses := []string{
		entities.StatusIdea,
		entities.StatusPlanning,
		entities.StatusActive,
		entities.StatusDebugging,
		entities.StatusTesting,
		entities.StatusOnHold,
		entities.StatusFinished,
		entities.StatusAbandoned,
	}
	isStatusValid := false
	for _, s := range validStatuses {
		if status == s {
			isStatusValid = true
			break
		}
	}
	if !isStatusValid {
		status = entities.StatusIdea // Default to Idea
	}

	// Create tech stack items slice
	var techStack []entities.TechStackItem
	for _, id := range techStackIDs {
		techStack = append(techStack, entities.TechStackItem{ID: id})
	}

	// Create project
	project := &entities.Project{
		ID:            uuid.New(),
		UserID:        userID,
		Title:         title,
		Description:   description,
		Status:        status,
		RepositoryURL: repositoryURL,
		TechStack:     techStack,
	}

	err := s.projectRepo.CreateProject(project)
	if err != nil {
		return nil, err
	}

	// Reload to get associations
	return s.projectRepo.FindProjectByID(project.ID)
}

// GetProject retrieves a single project (ensures user owns it)
func (s *projectService) GetProject(projectID, userID uuid.UUID) (*entities.Project, error) {
	project, err := s.projectRepo.FindProjectByID(projectID)
	if err != nil {
		return nil, err
	}

	// Verify ownership
	if project.UserID != userID {
		return nil, errors.New("unauthorized: project does not belong to user")
	}

	return project, nil
}

// GetUserProjects retrieves all projects for a user
func (s *projectService) GetUserProjects(userID uuid.UUID) ([]*entities.Project, error) {
	return s.projectRepo.FindProjectsByUserID(userID)
}

// GetProjectsWithFilters retrieves projects with filters for a user
func (s *projectService) GetProjectsWithFilters(userID uuid.UUID, status string, techStackIDs []uuid.UUID) ([]*entities.Project, error) {
	return s.projectRepo.FindProjectsByUserIDAndFilters(userID, status, techStackIDs)
}

// UpdateProject updates a project
func (s *projectService) UpdateProject(projectID, userID uuid.UUID, title, description string, status string, repositoryURL string, techStackIDs []uuid.UUID) (*entities.Project, error) {
	// Get project and verify ownership
	project, err := s.GetProject(projectID, userID)
	if err != nil {
		return nil, err
	}

	// Validate required fields
	if title == "" {
		return nil, errors.New("title is required")
	}
	if description == "" {
		return nil, errors.New("description is required")
	}

	// Validate status
	validStatuses := []string{
		entities.StatusIdea,
		entities.StatusPlanning,
		entities.StatusActive,
		entities.StatusDebugging,
		entities.StatusTesting,
		entities.StatusOnHold,
		entities.StatusFinished,
		entities.StatusAbandoned,
	}
	isStatusValid := false
	for _, s := range validStatuses {
		if status == s {
			isStatusValid = true
			break
		}
	}
	if !isStatusValid {
		return nil, errors.New("invalid status")
	}

	// Update fields
	project.Title = title
	project.Description = description
	project.Status = status
	project.RepositoryURL = repositoryURL

	// Update tech stack
	var techStack []entities.TechStackItem
	for _, id := range techStackIDs {
		techStack = append(techStack, entities.TechStackItem{ID: id})
	}
	project.TechStack = techStack

	err = s.projectRepo.UpdateProject(project)
	if err != nil {
		return nil, err
	}

	// Reload to get updated associations
	return s.projectRepo.FindProjectByID(projectID)
}

// DeleteProject deletes a project
func (s *projectService) DeleteProject(projectID, userID uuid.UUID) error {
	// Verify ownership first
	_, err := s.GetProject(projectID, userID)
	if err != nil {
		return err
	}

	return s.projectRepo.DeleteProject(projectID)
}

// AssignTaskToProject assigns a task to a project
func (s *projectService) AssignTaskToProject(projectID, taskID, userID uuid.UUID) error {
	// Verify project ownership
	project, err := s.GetProject(projectID, userID)
	if err != nil {
		return err
	}
	if project.UserID != userID {
		return errors.New("unauthorized: project does not belong to user")
	}

	// Verify task ownership
	task, err := s.taskRepo.FindTaskByID(taskID)
	if err != nil {
		return errors.New("task not found")
	}
	if task.UserID != userID {
		return errors.New("unauthorized: task does not belong to user")
	}

	// Check if task is already assigned to this project
	projectTasks, err := s.projectRepo.FindProjectTasks(projectID)
	if err != nil {
		return err
	}

	for _, pt := range projectTasks {
		if pt.TaskID == taskID {
			return errors.New("task already assigned to this project")
		}
	}

	// Create assignment
	projectTask := &entities.ProjectTask{
		ID:         uuid.New(),
		ProjectID:  projectID,
		TaskID:     taskID,
		AssignedAt: time.Now(),
	}

	return s.projectRepo.AssignTask(projectTask)
}

// UnassignTaskFromProject removes a task assignment from a project
func (s *projectService) UnassignTaskFromProject(projectID, taskID, userID uuid.UUID) error {
	// Verify project ownership
	_, err := s.GetProject(projectID, userID)
	if err != nil {
		return err
	}

	return s.projectRepo.UnassignTask(projectID, taskID)
}

// GetProjectTasks retrieves all tasks assigned to a project
func (s *projectService) GetProjectTasks(projectID, userID uuid.UUID) ([]*entities.ProjectTask, error) {
	// Verify project ownership
	_, err := s.GetProject(projectID, userID)
	if err != nil {
		return nil, err
	}

	return s.projectRepo.FindProjectTasks(projectID)
}

// CalculateProgress calculates the completion percentage of a project
func (s *projectService) CalculateProgress(projectID uuid.UUID) (float64, error) {
	projectTasks, err := s.projectRepo.FindProjectTasks(projectID)
	if err != nil {
		return 0, err
	}

	if len(projectTasks) == 0 {
		return 0.0, nil
	}

	completedCount := 0
	for _, pt := range projectTasks {
		if pt.Task.Status == entities.StatusDone {
			completedCount++
		}
	}

	return float64(completedCount) / float64(len(projectTasks)) * 100, nil
}
