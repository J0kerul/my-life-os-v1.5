package entities

import (
	"time"

	"github.com/google/uuid"
)

type Event struct {
	ID     uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	UserID uuid.UUID `gorm:"type:uuid;not null" json:"userId"`

	// Basic Info
	Title     string     `gorm:"type:varchar(255);not null" json:"title"`
	StartDate time.Time  `gorm:"type:timestamp;not null" json:"startDate"`
	EndDate   *time.Time `gorm:"type:timestamp" json:"endDate"` // nil = All Day
	AllDay    bool       `gorm:"not null;default:false" json:"allDay"`
	Domain    string     `gorm:"type:varchar(100);not null" json:"domain"` // Work, University, Personal, etc.

	// Recurrence
	IsRecurring    bool       `gorm:"not null;default:false" json:"isRecurring"`
	RecurrenceType *string    `gorm:"type:varchar(50)" json:"recurrenceType"` // daily, weekly, monthly, yearly
	RecurrenceEnd  *time.Time `gorm:"type:timestamp" json:"recurrenceEnd"`    // nil = never ends
	RecurrenceDays *string    `gorm:"type:text" json:"recurrenceDays"`        // JSON array: ["monday","wednesday"]

	// UI Options
	HideFromAgenda bool `gorm:"not null;default:false" json:"hideFromAgenda"`

	// Timestamps
	CreatedAt time.Time `gorm:"not null" json:"createdAt"`
	UpdatedAt time.Time `gorm:"not null" json:"updatedAt"`
}

type EventException struct {
	ID           uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	EventID      uuid.UUID `gorm:"type:uuid;not null" json:"eventId"`
	UserID       uuid.UUID `gorm:"type:uuid;not null" json:"userId"`
	OriginalDate time.Time `gorm:"type:timestamp;not null" json:"originalDate"` // Which occurrence was modified/deleted
	Type         string    `gorm:"type:varchar(50);not null" json:"type"`       // "deleted" or "modified"

	// For modified occurrences (nil = not modified)
	ModifiedTitle     *string    `gorm:"type:varchar(255)" json:"modifiedTitle"`
	ModifiedStartDate *time.Time `gorm:"type:timestamp" json:"modifiedStartDate"`
	ModifiedEndDate   *time.Time `gorm:"type:timestamp" json:"modifiedEndDate"`
	ModifiedDomain    *string    `gorm:"type:varchar(100)" json:"modifiedDomain"`
	ModifiedAllDay    *bool      `json:"modifiedAllDay"`

	CreatedAt time.Time `gorm:"not null" json:"createdAt"`
}
