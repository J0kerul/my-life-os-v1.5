package service

import (
	"errors"
	"time"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
	"github.com/google/uuid"
)

type scheduleEventService struct {
	scheduleRepo interfaces.ScheduleEventRepository
}

// NewScheduleEventService creates a new schedule event service
func NewScheduleEventService(scheduleRepo interfaces.ScheduleEventRepository) interfaces.ScheduleEventService {
	return &scheduleEventService{
		scheduleRepo: scheduleRepo,
	}
}

// CreateEvent creates a new schedule event
func (s *scheduleEventService) CreateEvent(event *entities.ScheduleEvent) error {
	// Validate dates
	if event.EndDate.Before(event.StartDate) {
		return errors.New("end date must be after start date")
	}

	// Validate domain
	validDomains := []string{
		entities.ScheduleDomainPersonal,
		entities.ScheduleDomainFamily,
		entities.ScheduleDomainWorking,
		entities.ScheduleDomainUniversity,
		entities.ScheduleDomainHealth,
		entities.ScheduleDomainSocial,
		entities.ScheduleDomainCoding,
		entities.ScheduleDomainHolidays,
	}
	isDomainValid := false
	for _, d := range validDomains {
		if event.Domain == d {
			isDomainValid = true
			break
		}
	}
	if !isDomainValid {
		return errors.New("invalid domain")
	}

	// Validate recurrence
	validRecurrence := []string{
		entities.RecurrenceNone,
		entities.RecurrenceDaily,
		entities.RecurrenceWeekly,
		entities.RecurrenceMonthly,
		entities.RecurrenceYearly,
	}
	isRecurrenceValid := false
	for _, r := range validRecurrence {
		if event.Recurrence == r {
			isRecurrenceValid = true
			break
		}
	}
	if !isRecurrenceValid {
		return errors.New("invalid recurrence type")
	}

	// Validate recurrence end date
	if event.Recurrence != entities.RecurrenceNone && event.RecurrenceEndDate != nil {
		if event.RecurrenceEndDate.Before(event.StartDate) {
			return errors.New("recurrence end date must be after start date")
		}
	}

	return s.scheduleRepo.CreateEvent(event)
}

// GetEvent retrieves a schedule event by ID
func (s *scheduleEventService) GetEvent(id uuid.UUID) (*entities.ScheduleEvent, error) {
	return s.scheduleRepo.FindEventByID(id)
}

// GetEventsByDateRange retrieves all events for a user within a date range
// Expands recurring events into individual instances
func (s *scheduleEventService) GetEventsByDateRange(userID uuid.UUID, startDate, endDate time.Time) ([]*entities.ScheduleEvent, error) {
	// Get all events in range (including one-time and recurring base events)
	events, err := s.scheduleRepo.FindEventsByDateRange(userID, startDate, endDate)
	if err != nil {
		return nil, err
	}

	// Get all recurring events to expand them
	recurringEvents, err := s.scheduleRepo.FindRecurringEvents(userID)
	if err != nil {
		return nil, err
	}

	// Expand recurring events into the date range
	expandedEvents := make([]*entities.ScheduleEvent, 0)
	for _, event := range recurringEvents {
		instances := s.expandRecurringEvent(event, startDate, endDate)
		expandedEvents = append(expandedEvents, instances...)
	}

	// Get exceptions for recurring events
	exceptionMap := make(map[string]bool)
	modifiedInstances := make([]*entities.ScheduleEvent, 0)
	for _, event := range recurringEvents {
		exceptions, err := s.scheduleRepo.FindExceptions(event.ID)
		if err != nil {
			continue
		}
		for _, ex := range exceptions {
			if ex.ExceptionDate != nil {
				exceptionMap[event.ID.String()+ex.ExceptionDate.Format("2006-01-02")] = true
			}
			// Add modified instances to results
			if ex.Title != "" { // Has actual data, not just deletion marker
				modifiedInstances = append(modifiedInstances, ex)
			}
		}
	}

	// Filter out exceptions from expanded events
	filteredExpanded := make([]*entities.ScheduleEvent, 0)
	for _, event := range expandedEvents {
		key := event.ID.String() + event.StartDate.Format("2006-01-02")
		if !exceptionMap[key] {
			filteredExpanded = append(filteredExpanded, event)
		}
	}

	// Combine one-time events with expanded recurring events and modified instances
	allEvents := append(events, filteredExpanded...)
	allEvents = append(allEvents, modifiedInstances...)

	return allEvents, nil
}

// expandRecurringEvent expands a recurring event into individual instances within a date range
func (s *scheduleEventService) expandRecurringEvent(event *entities.ScheduleEvent, rangeStart, rangeEnd time.Time) []*entities.ScheduleEvent {
	instances := make([]*entities.ScheduleEvent, 0)

	if event.Recurrence == entities.RecurrenceNone {
		return instances
	}

	current := event.StartDate
	duration := event.EndDate.Sub(event.StartDate)

	// Limit iterations to prevent infinite loops
	maxIterations := 1000
	iteration := 0

	for iteration < maxIterations {
		// Check if we've passed the recurrence end date
		if event.RecurrenceEndDate != nil && current.After(*event.RecurrenceEndDate) {
			break
		}

		// Check if we've passed the requested range
		if current.After(rangeEnd) {
			break
		}

		// If instance is in range, add it
		if !current.Before(rangeStart) {
			instance := *event
			instance.StartDate = current
			instance.EndDate = current.Add(duration)
			instances = append(instances, &instance)
		}

		// Calculate next occurrence
		switch event.Recurrence {
		case entities.RecurrenceDaily:
			current = current.AddDate(0, 0, 1)
		case entities.RecurrenceWeekly:
			current = current.AddDate(0, 0, 7)
		case entities.RecurrenceMonthly:
			current = current.AddDate(0, 1, 0)
		case entities.RecurrenceYearly:
			current = current.AddDate(1, 0, 0)
		}

		iteration++
	}

	return instances
}

// UpdateEvent updates an existing schedule event
func (s *scheduleEventService) UpdateEvent(event *entities.ScheduleEvent, updateType string) error {
	// Validate dates
	if event.EndDate.Before(event.StartDate) {
		return errors.New("end date must be after start date")
	}

	if event.Recurrence == entities.RecurrenceNone {
		// Simple update for non-recurring events
		return s.scheduleRepo.UpdateEvent(event)
	}

	// Handle recurring event updates
	if updateType == "single" {
		// Create an exception (modified instance)
		exception := *event
		eventID := event.ID
		exception.ParentEventID = &eventID
		exceptionDate := event.StartDate
		exception.ExceptionDate = &exceptionDate
		exception.ID = uuid.Nil // Let BeforeCreate generate new ID
		return s.scheduleRepo.CreateEvent(&exception)
	} else if updateType == "future" {
		// Update the base recurring event
		return s.scheduleRepo.UpdateEvent(event)
	}

	return errors.New("invalid update type, must be 'single' or 'future'")
}

// DeleteEvent removes a schedule event
func (s *scheduleEventService) DeleteEvent(id uuid.UUID, deleteType string) error {
	event, err := s.scheduleRepo.FindEventByID(id)
	if err != nil {
		return err
	}
	if event == nil {
		return errors.New("event not found")
	}

	if event.Recurrence == entities.RecurrenceNone {
		// Simple delete for non-recurring events
		return s.scheduleRepo.DeleteEvent(id)
	}

	// Handle recurring event deletion
	if deleteType == "single" {
		// Create a deletion exception (marker without data)
		exception := entities.ScheduleEvent{
			UserID:        event.UserID,
			ParentEventID: &event.ID,
			ExceptionDate: &event.StartDate,
			// No title or other data = deletion marker
		}
		return s.scheduleRepo.CreateEvent(&exception)
	} else if deleteType == "future" {
		// Set recurrence end date to now
		now := time.Now()
		event.RecurrenceEndDate = &now
		return s.scheduleRepo.UpdateEvent(event)
	} else if deleteType == "all" {
		// Delete the entire recurring event
		return s.scheduleRepo.DeleteEvent(id)
	}

	return errors.New("invalid delete type, must be 'single', 'future', or 'all'")
}

// CheckConflicts checks for time conflicts with other events
func (s *scheduleEventService) CheckConflicts(event *entities.ScheduleEvent) ([]*entities.ScheduleEvent, error) {
	// Holidays domain doesn't need conflict checking
	if event.Domain == entities.ScheduleDomainHolidays {
		return []*entities.ScheduleEvent{}, nil
	}

	// Get all events in the same time range
	events, err := s.scheduleRepo.FindEventsByDateRange(event.UserID, event.StartDate, event.EndDate)
	if err != nil {
		return nil, err
	}

	conflicts := make([]*entities.ScheduleEvent, 0)
	for _, existing := range events {
		// Skip self
		if existing.ID == event.ID {
			continue
		}

		// Skip holidays
		if existing.Domain == entities.ScheduleDomainHolidays {
			continue
		}

		// Check for time overlap
		if s.eventsOverlap(event, existing) {
			conflicts = append(conflicts, existing)
		}
	}

	return conflicts, nil
}

// eventsOverlap checks if two events overlap in time
func (s *scheduleEventService) eventsOverlap(event1, event2 *entities.ScheduleEvent) bool {
	// If both are all-day events, they don't conflict in terms of time blocking
	if event1.IsAllDay && event2.IsAllDay {
		return false
	}

	// Check if time ranges overlap
	return event1.StartDate.Before(event2.EndDate) && event2.StartDate.Before(event1.EndDate)
}
