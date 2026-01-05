package postgres

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
)

type tokenRepository struct {
	db *gorm.DB
}

func NewTokenRepository(db *gorm.DB) interfaces.TokenRepository {
	return &tokenRepository{db: db}
}

func (r *tokenRepository) CreateRefreshToken(token *entities.RefreshToken) error {
	return r.db.Create(token).Error
}

func (r *tokenRepository) FindRefreshTokenByHash(tokenHash string) (*entities.RefreshToken, error) {
	var token entities.RefreshToken
	err := r.db.Where("token_hash = ?", tokenHash).First(&token).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("refresh token not found")
		}
		return nil, err
	}

	return &token, nil
}

func (r *tokenRepository) DeleteRefreshTokenByHash(tokenHash string) error {
	result := r.db.Where("token_hash = ?", tokenHash).Delete(&entities.RefreshToken{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no refresh token found to delete")
	}
	return nil
}

func (r *tokenRepository) DeleteRefreshTokensByUserID(userID uuid.UUID) error {
	return r.db.Where("user_id = ?", userID).Delete(&entities.RefreshToken{}).Error
}

func (r *tokenRepository) DeleteExpiredRefreshTokens() error {
	return r.db.Where("expires_at < ?", time.Now()).Delete(&entities.RefreshToken{}).Error
}
