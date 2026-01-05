package interfaces

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/google/uuid"
)

// UserRepository defines the interface for user database operations.
type UserRepository interface {
	// CreateUser creates a new user in the database
	CreateUser(user *entities.User) error

	// FindUserByID retrieves a user by their unique ID
	FindUserByID(id uuid.UUID) (*entities.User, error)

	// FindUserByEmail retrieves a user by their email address
	FindUserByEmail(email string) (*entities.User, error)

	// UpdateUser updates an existing user's information
	UpdateUser(user *entities.User) error

	// CountUsers returns the total number of users in the database (for setup check)
	CountUsers() (int64, error)
}
