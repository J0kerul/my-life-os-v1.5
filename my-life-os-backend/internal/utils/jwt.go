package utils

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// Token expiry durations
const (
	AccessTokenExpiry  = 15 * time.Minute   // 15 minutes
	RefreshTokenExpiry = 7 * 24 * time.Hour // 7 days
)

// Token types
const (
	TokenTypeAccess  = "access"
	TokenTypeRefresh = "refresh"
)

// CustomClaims defines the JWT payload structure
type CustomClaims struct {
	UserID    uuid.UUID `json:"userId"`
	Email     string    `json:"email"`
	TokenType string    `json:"tokenType"`
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

	// Verify token type
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

	// Verify token type
	if claims.TokenType != TokenTypeRefresh {
		return nil, errors.New("invalid token type: expected refresh token")
	}

	return claims, nil
}

// validateToken is a helper function that validates any JWT token
func validateToken(tokenString, secret string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		// Verify signing method
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

// HashRefreshToken creates a SHA256 hash of the refresh token for database storage
// Note: We use SHA256 instead of Bcrypt because JWT tokens are too long (>72 bytes)
// and Bcrypt has a 72-byte input limit. SHA256 is secure for hashing tokens.
func HashRefreshToken(token string) (string, error) {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:]), nil
}

// VerifyRefreshTokenHash compares a token with its stored hash
func VerifyRefreshTokenHash(token, hash string) bool {
	tokenHash, err := HashRefreshToken(token)
	if err != nil {
		return false
	}
	return tokenHash == hash
}
