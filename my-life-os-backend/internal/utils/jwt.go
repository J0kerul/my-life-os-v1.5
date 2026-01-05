package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// token expiry durations
const (
	AccessTokenExpiry  = 15 * time.Minute
	RefreshTokenExpiry = 7 * 24 * time.Hour
)

// Token types
const (
	TokenTypeAccess  = "access"
	TokenTypeRefresh = "refresh"
)

// CustomClaims defines the JWT payload structure
type CustomClaims struct {
	UserID    uuid.UUID `json:"user_id"`
	Email     string    `json:"email"`
	TokenType string    `json:"token_type"`
	jwt.RegisteredClaims
}

// GenerateAccessToken creates a short-lived access token (15 minutes)
func GenerateAccessToken(userID uuid.UUID, email, secret string) (string, error) {
	now := time.Now()

	claims := CustomClaims{
		UserID:    userID,
		Email:     email,
		TokenType: TokenTypeAccess,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(AccessTokenExpiry)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// GenerateRefreshToken creates a long-lived refresh token (7 days)
func GenerateRefreshToken(userID uuid.UUID, email, secret string) (string, error) {
	now := time.Now()

	claims := CustomClaims{
		UserID:    userID,
		Email:     email,
		TokenType: TokenTypeRefresh,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(RefreshTokenExpiry)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// ValidateAccessToken verifies an access token and returns the claims
func ValidateAccessToken(tokenString, secret string) (*CustomClaims, error) {
	claims, err := validateToken(tokenString, secret)
	if err != nil {
		return nil, err
	}

	// verify token type
	if claims.TokenType != TokenTypeAccess {
		return nil, errors.New("invalid token type: expected access token")
	}

	return claims, nil
}

// ValidateRefreshToken verifies a refresh token and returns the claims
func ValidateRefreshToken(tokenString, secret string) (*CustomClaims, error) {
	claims, err := validateToken(tokenString, secret)
	if err != nil {
		return nil, err
	}

	// verify token type
	if claims.TokenType != TokenTypeRefresh {
		return nil, errors.New("invalid token type: expected refresh token")
	}

	return claims, nil
}

// validateToken is a helper function to parse and validate a JWT token
func validateToken(tokenString, secret string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		// verify signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*CustomClaims)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	return claims, nil
}

// HashRefreshToken creates a hash of the refresh token for database storage
// We store the hash, not the raw token (same principle as passwords!)
func HashRefreshToken(token string) (string, error) {
	// We can reuse the password hashing since it's the same Bcrypt
	return HashPassword(token)
}

// VerifyRefreshTokenHash compares a token with its stored hash
func VerifyRefreshTokenHash(token, hash string) bool {
	// We can reuse the password checking since it's the same Bcrypt
	return CheckPassword(token, hash)
}
