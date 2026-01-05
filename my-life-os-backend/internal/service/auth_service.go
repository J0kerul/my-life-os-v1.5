package service

import (
	"errors"
	"time"

	"github.com/google/uuid"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/utils"
)

type authService struct {
	userRepo  interfaces.UserRepository
	tokenRepo interfaces.TokenRepository
	jwtSecret string
}

func NewAuthService(
	userRepo interfaces.UserRepository,
	tokenRepo interfaces.TokenRepository,
	jwtSecret string,
) interfaces.AuthService {
	return &authService{
		userRepo:  userRepo,
		tokenRepo: tokenRepo,
		jwtSecret: jwtSecret,
	}
}

func (s *authService) NeedsSetup() (bool, error) {
	count, err := s.userRepo.CountUsers()
	if err != nil {
		return false, err
	}
	return count == 0, nil
}

func (s *authService) Register(name, email, password string) (*entities.User, *interfaces.TokenPair, error) {
	// Check if setup is still needed
	needsSetup, err := s.NeedsSetup()
	if err != nil {
		return nil, nil, err
	}
	if !needsSetup {
		return nil, nil, errors.New("setup already completed")
	}

	// Validate password strength
	if err := utils.ValidatePassword(password); err != nil {
		return nil, nil, err
	}

	// Check if email already exists (shouldn't happen, but safety check)
	existingUser, _ := s.userRepo.FindUserByEmail(email)
	if existingUser != nil {
		return nil, nil, errors.New("email already registered")
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return nil, nil, errors.New("failed to hash password")
	}

	// Create user
	user := &entities.User{
		Name:         name,
		Email:        email,
		PasswordHash: hashedPassword,
		Timezone:     "Europe/Berlin",
	}

	if err := s.userRepo.CreateUser(user); err != nil {
		return nil, nil, errors.New("failed to create user")
	}

	// Generate tokens
	tokens, err := s.generateTokenPair(user)
	if err != nil {
		return nil, nil, err
	}

	return user, tokens, nil
}

func (s *authService) Login(email, password string) (*entities.User, *interfaces.TokenPair, error) {
	// Find user by email
	user, err := s.userRepo.FindUserByEmail(email)
	if err != nil {
		return nil, nil, errors.New("invalid credentials")
	}

	// Verify password
	if !utils.CheckPassword(password, user.PasswordHash) {
		return nil, nil, errors.New("invalid credentials")
	}

	// Generate tokens
	tokens, err := s.generateTokenPair(user)
	if err != nil {
		return nil, nil, err
	}
	return user, tokens, nil
}

func (s *authService) RefreshTokens(refreshTokenString string) (*interfaces.TokenPair, error) {
	// Validate refresh token
	claims, err := utils.ValidateRefreshToken(refreshTokenString, s.jwtSecret)
	if err != nil {
		return nil, errors.New("invalid refresh token")
	}

	// Hash the token to find it in the database
	tokenHash, err := utils.HashRefreshToken(refreshTokenString)
	if err != nil {
		return nil, errors.New("failed to hash refresh token")
	}

	// Find refresh token in database
	storedToken, err := s.tokenRepo.FindRefreshTokenByHash(tokenHash)
	if err != nil {
		return nil, errors.New("refresh token not found")
	}

	// Check if token is expired
	if storedToken.IsExpired() {
		// Clean up expired token
		s.tokenRepo.DeleteRefreshTokenByHash(tokenHash)
		return nil, errors.New("refresh token expired")
	}

	// Find user
	user, err := s.userRepo.FindUserByID(claims.UserID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	// Generate new token pair
	tokens, err := s.generateTokenPair(user)
	if err != nil {
		return nil, err
	}
	return tokens, nil
}

func (s *authService) Logout(userID uuid.UUID) error {
	return s.tokenRepo.DeleteRefreshTokensByUserID(userID)
}

func (s *authService) ValidateAccessToken(tokenString string) (uuid.UUID, error) {
	claims, err := utils.ValidateAccessToken(tokenString, s.jwtSecret)
	if err != nil {
		return uuid.Nil, err
	}
	return claims.UserID, nil
}

func (s *authService) generateTokenPair(user *entities.User) (*interfaces.TokenPair, error) {
	// Generate access token (15 minutes)
	accessToken, err := utils.GenerateAccessToken(user.ID, user.Email, s.jwtSecret)
	if err != nil {
		return nil, errors.New("failed to generate access token")
	}

	// Generate refresh token (7 days)
	refreshToken, err := utils.GenerateRefreshToken(user.ID, user.Email, s.jwtSecret)
	if err != nil {
		return nil, errors.New("failed to generate refresh token")
	}

	// Hash refresh token for database storage
	tokenHash, err := utils.HashRefreshToken(refreshToken)
	if err != nil {
		return nil, errors.New("failed to hash refresh token")
	}

	// Store refresh token in database
	refreshTokenEntity := &entities.RefreshToken{
		UserID:    user.ID,
		TokenHash: tokenHash,
		ExpiresAt: time.Now().Add(utils.RefreshTokenExpiry),
	}

	if err := s.tokenRepo.CreateRefreshToken(refreshTokenEntity); err != nil {
		return nil, errors.New("failed to store refresh token")
	}

	return &interfaces.TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}
