package service

import (
	"errors"
	"time"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"

	"github.com/google/uuid"
)

type taskService struct {
	taskRepo interfaces.TaskRepository
}

// NewTaskService creates a new task service
func NewTaskService(taskRepo interfaces.TaskRepository) interfaces.TaskService {
	return &taskService{
		taskRepo: taskRepo,
	}
}

// CreateTask creates a new task
func (s *taskService) CreateTask(userID uuid.UUID, title, description, priority, domain string, deadline *string) (*entities.Task, error) {
	// Validate required fields
	if title == "" {
		return nil, errors.New("title is required")
	}

	// Validate priority
	if priority != entities.PriorityLow && priority != entities.PriorityMedium && priority != entities.PriorityHigh {
		priority = entities.PriorityMedium // Default to Medium
	}

	// Validate domain
	validDomains := []string{
		entities.DomainWork,
		entities.DomainUniversity,
		entities.DomainCodingProject,
		entities.DomainPersonalProject,
		entities.DomainGoals,
		entities.DomainFinances,
		entities.DomainHousehold,
		entities.DomainHealth,
	}
	isDomainValid := false
	for _, d := range validDomains {
		if domain == d {
			isDomainValid = true
			break
		}
	}
	if !isDomainValid {
		return nil, errors.New("invalid domain")
	}

	// Parse deadline if provided
	var deadlineTime *time.Time
	if deadline != nil && *deadline != "" {
		parsedTime, err := time.Parse(time.RFC3339, *deadline)
		if err != nil {
			return nil, errors.New("invalid deadline format")
		}
		deadlineTime = &parsedTime
	}

	// Create task
	task := &entities.Task{
		ID:          uuid.New(),
		UserID:      userID,
		Title:       title,
		Description: description,
		Priority:    priority,
		Status:      entities.StatusTodo,
		Domain:      domain,
		Deadline:    deadlineTime,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	err := s.taskRepo.CreateTask(task)
	if err != nil {
		return nil, err
	}

	return task, nil
}

// GetTask retrieves a single task (ensures user owns it)
func (s *taskService) GetTask(taskID, userID uuid.UUID) (*entities.Task, error) {
	task, err := s.taskRepo.FindTaskByID(taskID)
	if err != nil {
		return nil, err
	}

	// Verify ownership
	if task.UserID != userID {
		return nil, errors.New("unauthorized: task does not belong to user")
	}

	return task, nil
}

// GetUserTasks retrieves all tasks for a user
func (s *taskService) GetUserTasks(userID uuid.UUID) ([]*entities.Task, error) {
	return s.taskRepo.FindTasksByUserID(userID)
}

// GetUserTasksWithFilters retrieves tasks with filters
func (s *taskService) GetUserTasksWithFilters(userID uuid.UUID, domain, status, timeFilter string) ([]*entities.Task, error) {
	// Get all user tasks first
	allTasks, err := s.taskRepo.FindTasksByUserID(userID)
	if err != nil {
		return nil, err
	}

	// Apply filters
	var filteredTasks []*entities.Task

	for _, task := range allTasks {
		// Domain filter
		if domain != "" && task.Domain != domain {
			continue
		}

		// Status filter
		if status != "" && task.Status != status {
			continue
		}

		// Time filter (Long Term, Morgen, Next Week, Next Month)
		if timeFilter != "" {
			if !s.matchesTimeFilter(task, timeFilter) {
				continue
			}
		}

		filteredTasks = append(filteredTasks, task)
	}

	return filteredTasks, nil
}

// matchesTimeFilter checks if task matches time filter
func (s *taskService) matchesTimeFilter(task *entities.Task, timeFilter string) bool {
	now := time.Now()
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	switch timeFilter {
	case "long_term":
		// Tasks with no deadline
		return task.Deadline == nil

	case "overdue":
		// Tasks with deadline in the past and not completed
		if task.Deadline == nil {
			return false
		}
		if task.Status == entities.StatusDone {
			return false
		}
		return task.Deadline.Before(todayStart)

	case "today":
		// Tasks due today (only those with deadline set to today)
		if task.Deadline == nil {
			return false
		}
		tomorrowStart := todayStart.Add(24 * time.Hour)
		return !task.Deadline.Before(todayStart) && task.Deadline.Before(tomorrowStart)

	case "tomorrow":
		// Tasks due tomorrow
		if task.Deadline == nil {
			return false
		}
		tomorrow := now.AddDate(0, 0, 1)
		tomorrowStart := time.Date(tomorrow.Year(), tomorrow.Month(), tomorrow.Day(), 0, 0, 0, 0, tomorrow.Location())
		tomorrowEnd := tomorrowStart.Add(24 * time.Hour)
		return !task.Deadline.Before(tomorrowStart) && task.Deadline.Before(tomorrowEnd)

	case "next_week":
		// Tasks due in next 7 days (rolling window from today)
		if task.Deadline == nil {
			return false
		}
		nextWeekEnd := now.AddDate(0, 0, 7)
		return task.Deadline.After(now) && task.Deadline.Before(nextWeekEnd)

	case "next_month":
		// Tasks due in next 30 days (rolling window from today)
		if task.Deadline == nil {
			return false
		}
		nextMonthEnd := now.AddDate(0, 0, 30)
		return task.Deadline.After(now) && task.Deadline.Before(nextMonthEnd)

	default:
		return true
	}
}

// UpdateTask updates a task
func (s *taskService) UpdateTask(taskID, userID uuid.UUID, title, description, priority, domain string, deadline *string) (*entities.Task, error) {
	// Get existing task
	task, err := s.GetTask(taskID, userID)
	if err != nil {
		return nil, err
	}

	// Update fields
	if title != "" {
		task.Title = title
	}
	task.Description = description

	if priority != "" {
		if priority == entities.PriorityLow || priority == entities.PriorityMedium || priority == entities.PriorityHigh {
			task.Priority = priority
		}
	}

	if domain != "" {
		validDomains := []string{
			entities.DomainWork,
			entities.DomainUniversity,
			entities.DomainCodingProject,
			entities.DomainPersonalProject,
			entities.DomainGoals,
			entities.DomainFinances,
			entities.DomainHousehold,
			entities.DomainHealth,
		}
		isDomainValid := false
		for _, d := range validDomains {
			if domain == d {
				isDomainValid = true
				break
			}
		}
		if isDomainValid {
			task.Domain = domain
		}
	}

	// Update deadline
	if deadline != nil {
		if *deadline == "" {
			// Clear deadline
			task.Deadline = nil
		} else {
			parsedTime, err := time.Parse(time.RFC3339, *deadline)
			if err != nil {
				return nil, errors.New("invalid deadline format")
			}
			task.Deadline = &parsedTime
		}
	}

	task.UpdatedAt = time.Now()

	err = s.taskRepo.UpdateTask(task)
	if err != nil {
		return nil, err
	}

	return task, nil
}

// ToggleTaskStatus toggles task status between Todo and Done
func (s *taskService) ToggleTaskStatus(taskID, userID uuid.UUID) (*entities.Task, error) {
	// Get task and verify ownership
	task, err := s.GetTask(taskID, userID)
	if err != nil {
		return nil, err
	}

	// Toggle status
	if task.Status == entities.StatusTodo {
		task.Status = entities.StatusDone
	} else {
		task.Status = entities.StatusTodo
	}

	task.UpdatedAt = time.Now()

	err = s.taskRepo.UpdateTask(task)
	if err != nil {
		return nil, err
	}

	return task, nil
}

// DeleteTask deletes a task
func (s *taskService) DeleteTask(taskID, userID uuid.UUID) error {
	// Verify ownership first
	_, err := s.GetTask(taskID, userID)
	if err != nil {
		return err
	}

	return s.taskRepo.DeleteTask(taskID)
}
