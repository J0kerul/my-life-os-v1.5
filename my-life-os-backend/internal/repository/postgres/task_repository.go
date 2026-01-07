package postgres

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type taskRepository struct {
	db *gorm.DB
}

// NewTaskRepository creates a new task repository
func NewTaskRepository(db *gorm.DB) interfaces.TaskRepository {
	return &taskRepository{db: db}
}

// Create creates a new task
func (r *taskRepository) CreateTask(task *entities.Task) error {
	return r.db.Create(task).Error
}

// FindByID retrieves a task by ID
func (r *taskRepository) FindTaskByID(id uuid.UUID) (*entities.Task, error) {
	var task entities.Task
	err := r.db.Where("id = ?", id).First(&task).Error
	if err != nil {
		return nil, err
	}
	return &task, nil
}

// FindByUserID retrieves all tasks for a user
func (r *taskRepository) FindTasksByUserID(userID uuid.UUID) ([]*entities.Task, error) {
	var tasks []*entities.Task
	// Order by deadline ascending (closest first), NULL deadlines last
	err := r.db.Where("user_id = ?", userID).
		Order("CASE WHEN deadline IS NULL THEN 1 ELSE 0 END"). // NULLs last
		Order("deadline ASC").                                 // Closest deadline first
		Order("created_at DESC").                              // Then by creation date
		Find(&tasks).Error
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

// FindByUserIDAndFilters retrieves tasks with filters
func (r *taskRepository) FindTasksByUserIDAndFilters(userID uuid.UUID, filters map[string]interface{}) ([]*entities.Task, error) {
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

// Update updates a task
func (r *taskRepository) UpdateTask(task *entities.Task) error {
	return r.db.Save(task).Error
}

// UpdateStatus updates only the task status
func (r *taskRepository) UpdateStatus(id uuid.UUID, status string) error {
	return r.db.Model(&entities.Task{}).Where("id = ?", id).Update("status", status).Error
}

// Delete deletes a task
func (r *taskRepository) DeleteTask(id uuid.UUID) error {
	return r.db.Delete(&entities.Task{}, id).Error
}
