package interfaces

import (
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/google/uuid"
)

// TokenPair represents both access and refresh tokens.
type TokenPair struct {
	AccessToken  string
	RefreshToken string
}

// AuthService defines the interface for authentication business logic.
type AuthService interface {
	// NeedsSetup checks if the authentication system needs initial setup (no users exist)
	NeedsSetup() (bool, error)

	// Register creates a new user account (only works if setup is needed)
	Register(name, email, password string) (*entities.User, *TokenPair, error)

	// Login authenticates a user and returns tokens
	Login(email, password string) (*entities.User, *TokenPair, error)

	// RefreshTokens generates new tokens using a valid refresh token
	RefreshTokens(refreshToken string) (*TokenPair, error)

	// Logout invalidates all refresh tokens for a user
	Logout(userID uuid.UUID) error

	// ValidateAccessToken verifies an access token and returns the user ID
	ValidateAccessToken(accessToken string) (uuid.UUID, error)
}
