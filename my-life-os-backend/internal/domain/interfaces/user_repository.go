package interfaces

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/google/uuid"
)

// UserRepository defines the interface for user database operations.
type UserRepository interface {
	// Create creates a new user in the database
	Create(user *entities.User) error

	// FindByID retrieves a user by their unique ID
	FindByID(id uuid.UUID) (*entities.User, error)

	// FindByEmail retrieves a user by their email address
	FindByEmail(email string) (*entities.User, error)

	// Update updates an existing user's information
	Update(user *entities.User) error

	// Count returns the total number of users in the database (for setup check)
	Count() (int64, error)
}
