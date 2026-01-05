package interfaces

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/google/uuid"
)

// TokenRepository defines the interface for token database operations.
type TokenRepository interface {
	// Create stores a new refresh token in the database
	Create(token *entities.RefreshToken) error

	// FindByHash retrieves a refresh token by its hash
	FindByHash(tokenHash string) (*entities.RefreshToken, error)

	// DeleteByHash removes a refresh token by its hash (used during refresh/logout)
	DeleteByHash(tokenHash string) error

	// DeleteByUserID removes all refresh tokens for a specific user (used during logout)
	DeleteByUserID(userID uuid.UUID) error

	// DeleteExpired removes all expired refresh tokens (cleanup)
	DeleteExpired() error
}
