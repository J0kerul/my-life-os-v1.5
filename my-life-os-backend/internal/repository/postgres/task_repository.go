package postgres

import (
	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
)

type taskRepository struct {
	db *gorm.DB
}

// NewTaskRepository creates a new instance of TaskRepository
func NewTaskRepository(db *gorm.DB) interfaces.TaskRepository {
	return &taskRepository{db: db}
}

// CreateTask adds a new task to the database.
func (r *taskRepository) CreateTask(task *entities.Task) error {
	return r.db.Create(task).Error
}

// FindTaskByID retrieves a task by its ID.
func (r *taskRepository) FindTaskByID(taskID uuid.UUID) (*entities.Task, error) {
	var task entities.Task
	err := r.db.Where("id = ?", taskID).First(&task).Error
	if err != nil {
		return nil, err
	}
	return &task, nil
}

// FindTaskByUserID retrieves all tasks for a user
func (r *taskRepository) FindTasksByUserID(userID uuid.UUID) ([]*entities.Task, error) {
	var tasks []*entities.Task
	err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Find(&tasks).Error
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

// FindTasksByUserIDAndFilters retrieves tasks with filters
func (r *taskRepository) FindTasksByUserIDAndFilters(userID uuid.UUID, filters map[string]any) ([]*entities.Task, error) {
	var tasks []*entities.Task
	query := r.db.Where("user_id = ?", userID)

	// Apply filters
	for key, value := range filters {
		query = query.Where(key+" = ?", value)
	}

	err := query.Order("created_at DESC").Find(&tasks).Error
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

// UpdateTask modifies an existing task.
func (r *taskRepository) UpdateTask(task *entities.Task) error {
	return r.db.Save(task).Error
}

func (r *taskRepository) UpdateStatus(taskID uuid.UUID, status string) error {
	return r.db.Model(&entities.Task{}).Where("id = ?", taskID).Update("status", status).Error
}

// DeleteTask removes a task from the database.
func (r *taskRepository) DeleteTask(taskID uuid.UUID) error {
	return r.db.Where("id = ?", taskID).Delete(&entities.Task{}).Error
}
