package entities

import (
	"time"

	"github.com/google/uuid"
)

// YearlyDate represents month and day for yearly routines
type YearlyDate struct {
	Month int `json:"month"` // 1-12
	Day   int `json:"day"`   // 1-31
}

// Routine represents a reccuring task or habit
type Routine struct {
	ID     uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	UserID uuid.UUID `gorm:"type:uuid;not null" json:"userId"`
	Title  string    `gorm:"type:varchar(255);not null" json:"title"`

	// Frequency settings
	Frequency    string      `gorm:"type:varchar(50);not null" json:"frequency"` // Daily, Weekly, Monthly, Quarterly, Yearly
	Weekday      *int        `gorm:"type:int" json:"weekday"`                    // 0-6 for Weekly (0=Sunday)
	DayOfMonth   *int        `gorm:"type:int" json:"dayOfMonth"`                 // 1-31 for Monthly
	QuarterlyDay *int        `gorm:"type:int" json:"quarterlyDay"`               // 1-31 for Quarterly
	YearlyDate   *YearlyDate `gorm:"type:jsonb" json:"yearlyDate"`               // {month, day} for Yearly

	// Options
	IsSkippable bool `gorm:"not null;default:false" json:"isSkippable"`
	ShowStreak  bool `gorm:"not null;default:false" json:"showStreak"`

	// Time settings
	TimeType     string  `gorm:"type:varchar(50);not null" json:"timeType"` // AM, PM, AllDay, Specific
	SpecificTime *string `gorm:"type:varchar(5)" json:"specificTime"`       // HH:mm format if TimeType=Specific

	// Streak tracking
	CurrentStreak int `gorm:"not null;default:0" json:"currentStreak"`
	LongestStreak int `gorm:"not null;default:0" json:"longestStreak"`

	// Timestamps
	CreatedAt time.Time `gorm:"not null" json:"createdAt"`
	UpdatedAt time.Time `gorm:"not null" json:"updatedAt"`
}
