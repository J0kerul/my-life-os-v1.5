package entities

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Schedule event domains
const (
	ScheduleDomainPersonal   = "Personal"
	ScheduleDomainFamily     = "Family"
	ScheduleDomainWorking    = "Working"
	ScheduleDomainUniversity = "University"
	ScheduleDomainHealth     = "Health"
	ScheduleDomainSocial     = "Social"
	ScheduleDomainCoding     = "Coding"
	ScheduleDomainHolidays   = "Holidays"
)

// Schedule event recurrence types
const (
	RecurrenceNone    = "none"
	RecurrenceDaily   = "daily"
	RecurrenceWeekly  = "weekly"
	RecurrenceMonthly = "monthly"
	RecurrenceYearly  = "yearly"
)

// ScheduleEvent represents a calendar event with time blocking
type ScheduleEvent struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	UserID      uuid.UUID `gorm:"type:uuid;not null;index" json:"userId"`
	Title       string    `gorm:"type:text;not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	Domain      string    `gorm:"type:text;not null" json:"domain"`
	StartDate   time.Time `gorm:"type:timestamptz;not null;index" json:"startDate"`
	EndDate     time.Time `gorm:"type:timestamptz;not null;index" json:"endDate"`
	IsAllDay    bool      `gorm:"not null;default:false" json:"isAllDay"`
	Location    string    `gorm:"type:text" json:"location"`

	// Task linking
	LinkedTaskID *uuid.UUID `gorm:"type:uuid;index" json:"linkedTaskId,omitempty"`

	// Recurrence
	Recurrence        string     `gorm:"type:text;not null;default:'none';index" json:"recurrence"`
	RecurrenceEndDate *time.Time `gorm:"type:timestamptz;index" json:"recurrenceEndDate,omitempty"`

	// Exception handling for recurring events
	ParentEventID *uuid.UUID `gorm:"type:uuid;index" json:"parentEventId,omitempty"`
	ExceptionDate *time.Time `gorm:"type:timestamptz" json:"exceptionDate,omitempty"`

	CreatedAt time.Time `gorm:"type:timestamptz;not null" json:"createdAt"`
	UpdatedAt time.Time `gorm:"type:timestamptz;not null" json:"updatedAt"`
}

// TableName specifies the table name for ScheduleEvent
func (ScheduleEvent) TableName() string {
	return "schedule_events"
}

// BeforeCreate hook - generates UUID before creating
func (e *ScheduleEvent) BeforeCreate(tx *gorm.DB) error {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return nil
}
