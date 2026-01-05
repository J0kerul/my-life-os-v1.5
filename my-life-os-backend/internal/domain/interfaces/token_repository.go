package interfaces

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/google/uuid"
)

// TokenRepository defines the interface for token database operations.
type TokenRepository interface {
	// CreateRefreshToken stores a new refresh token in the database
	CreateRefreshToken(token *entities.RefreshToken) error

	// FindRefreshTokenByHash retrieves a refresh token by its hash
	FindRefreshTokenByHash(tokenHash string) (*entities.RefreshToken, error)

	// DeleteRefreshTokenByHash removes a refresh token by its hash (used during refresh/logout)
	DeleteRefreshTokenByHash(tokenHash string) error

	// DeleteRefreshTokensByUserID removes all refresh tokens for a specific user (used during logout)
	DeleteRefreshTokensByUserID(userID uuid.UUID) error

	// DeleteExpiredRefreshTokens removes all expired refresh tokens (cleanup)
	DeleteExpiredRefreshTokens() error
}
