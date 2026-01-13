package service

import (
	"encoding/json"
	"errors"
	"time"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"

	"github.com/google/uuid"
)

type eventService struct {
	eventRepo interfaces.EventRepository
}

// NewEventService creates a new event service
func NewEventService(eventRepo interfaces.EventRepository) interfaces.EventService {
	return &eventService{
		eventRepo: eventRepo,
	}
}

// CreateEvent creates a new event
func (s *eventService) CreateEvent(userID uuid.UUID, title string, startDate time.Time, endDate *time.Time,
	allDay bool, domain string, isRecurring bool, recurrenceType *string, recurrenceEnd *time.Time,
	recurrenceDays *string, hideFromAgenda bool) (*entities.Event, error) {

	// Validate required fields
	if title == "" {
		return nil, errors.New("title is required")
	}

	// Validate domain
	validDomains := []string{
		"Work", "University", "Personal", "Coding Time", "Study",
		"Health", "Social", "Holidays", "Travel", "Maintenance", "Entertainment", "Family",
	}
	isDomainValid := false
	for _, d := range validDomains {
		if domain == d {
			isDomainValid = true
			break
		}
	}
	if !isDomainValid {
		return nil, errors.New("invalid domain")
	}

	// Validate recurrence if recurring
	if isRecurring {
		if recurrenceType == nil || *recurrenceType == "" {
			return nil, errors.New("recurrence type is required for recurring events")
		}

		validRecurrenceTypes := []string{"daily", "weekly", "monthly", "yearly"}
		isTypeValid := false
		for _, t := range validRecurrenceTypes {
			if *recurrenceType == t {
				isTypeValid = true
				break
			}
		}
		if !isTypeValid {
			return nil, errors.New("invalid recurrence type")
		}

		// Validate weekly recurrence days
		if *recurrenceType == "weekly" {
			if recurrenceDays == nil || *recurrenceDays == "" {
				return nil, errors.New("recurrence days are required for weekly recurring events")
			}

			// Validate JSON format
			var days []string
			if err := json.Unmarshal([]byte(*recurrenceDays), &days); err != nil {
				return nil, errors.New("invalid recurrence days format")
			}

			// Validate day names
			validDays := map[string]bool{
				"monday": true, "tuesday": true, "wednesday": true, "thursday": true,
				"friday": true, "saturday": true, "sunday": true,
			}
			for _, day := range days {
				if !validDays[day] {
					return nil, errors.New("invalid day name in recurrence days")
				}
			}
		}
	}

	// Validate time range for non-all-day events
	if !allDay && endDate != nil {
		if endDate.Before(startDate) {
			return nil, errors.New("end date cannot be before start date")
		}
	}

	// Check for conflicts (only for non-all-day events)
	if !allDay && endDate != nil {
		hasConflict, err := s.CheckConflict(userID, startDate, endDate, allDay, nil)
		if err != nil {
			return nil, err
		}
		if hasConflict {
			return nil, errors.New("event conflicts with an existing event")
		}
	}

	// Create event
	event := &entities.Event{
		ID:             uuid.New(),
		UserID:         userID,
		Title:          title,
		StartDate:      startDate,
		EndDate:        endDate,
		AllDay:         allDay,
		Domain:         domain,
		IsRecurring:    isRecurring,
		RecurrenceType: recurrenceType,
		RecurrenceEnd:  recurrenceEnd,
		RecurrenceDays: recurrenceDays,
		HideFromAgenda: hideFromAgenda,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	err := s.eventRepo.CreateEvent(event)
	if err != nil {
		return nil, err
	}

	return event, nil
}

// GetEvent retrieves a single event (ensures user owns it)
func (s *eventService) GetEvent(eventID, userID uuid.UUID) (*entities.Event, error) {
	event, err := s.eventRepo.FindEventByID(eventID)
	if err != nil {
		return nil, err
	}

	// Verify ownership
	if event.UserID != userID {
		return nil, errors.New("unauthorized: event does not belong to user")
	}

	return event, nil
}

// GetUserEventsInRange retrieves all events (expanded occurrences) for a user in date range
func (s *eventService) GetUserEventsInRange(userID uuid.UUID, start, end time.Time) ([]*entities.Event, error) {
	// Get base events from repository
	baseEvents, err := s.eventRepo.FindEventsByUserIDAndDateRange(userID, start, end)
	if err != nil {
		return nil, err
	}

	var expandedEvents []*entities.Event

	for _, baseEvent := range baseEvents {
		if !baseEvent.IsRecurring {
			// Non-recurring event - add directly
			expandedEvents = append(expandedEvents, baseEvent)
		} else {
			// Recurring event - expand occurrences
			occurrences := s.expandRecurringEvent(baseEvent, start, end)

			// Get exceptions for this event
			exceptions, err := s.eventRepo.FindEventExceptionsByDateRange(baseEvent.ID, start, end)
			if err != nil {
				return nil, err
			}

			// Apply exceptions
			occurrences = s.applyExceptions(occurrences, exceptions)

			expandedEvents = append(expandedEvents, occurrences...)
		}
	}

	return expandedEvents, nil
}

// expandRecurringEvent generates all occurrences of a recurring event within a date range
func (s *eventService) expandRecurringEvent(baseEvent *entities.Event, start, end time.Time) []*entities.Event {
	var occurrences []*entities.Event

	if baseEvent.RecurrenceType == nil {
		return occurrences
	}

	current := baseEvent.StartDate

	// Ensure current is within range
	if current.Before(start) {
		current = start
	}

	// Calculate recurrence end
	recurrenceEnd := end
	if baseEvent.RecurrenceEnd != nil && baseEvent.RecurrenceEnd.Before(end) {
		recurrenceEnd = *baseEvent.RecurrenceEnd
	}

	switch *baseEvent.RecurrenceType {
	case "daily":
		for current.Before(recurrenceEnd) || current.Equal(recurrenceEnd) {
			if (current.After(start) || current.Equal(start)) && (current.Before(end) || current.Equal(end)) {
				occurrence := s.createOccurrence(baseEvent, current)
				occurrences = append(occurrences, occurrence)
			}
			current = current.AddDate(0, 0, 1)
		}

	case "weekly":
		if baseEvent.RecurrenceDays == nil {
			return occurrences
		}

		var selectedDays []string
		if err := json.Unmarshal([]byte(*baseEvent.RecurrenceDays), &selectedDays); err != nil {
			return occurrences
		}

		dayMap := map[string]time.Weekday{
			"sunday": time.Sunday, "monday": time.Monday, "tuesday": time.Tuesday,
			"wednesday": time.Wednesday, "thursday": time.Thursday,
			"friday": time.Friday, "saturday": time.Saturday,
		}

		for current.Before(recurrenceEnd) || current.Equal(recurrenceEnd) {
			currentWeekday := current.Weekday()
			for _, dayName := range selectedDays {
				if dayMap[dayName] == currentWeekday {
					if (current.After(start) || current.Equal(start)) && (current.Before(end) || current.Equal(end)) {
						occurrence := s.createOccurrence(baseEvent, current)
						occurrences = append(occurrences, occurrence)
					}
					break
				}
			}
			current = current.AddDate(0, 0, 1)
		}

	case "monthly":
		targetDay := baseEvent.StartDate.Day()
		for current.Before(recurrenceEnd) || current.Equal(recurrenceEnd) {
			if current.Day() == targetDay {
				if (current.After(start) || current.Equal(start)) && (current.Before(end) || current.Equal(end)) {
					occurrence := s.createOccurrence(baseEvent, current)
					occurrences = append(occurrences, occurrence)
				}
			}
			current = current.AddDate(0, 1, 0)
			// Adjust for months with fewer days
			if current.Day() < targetDay {
				current = time.Date(current.Year(), current.Month(), targetDay, current.Hour(), current.Minute(), current.Second(), current.Nanosecond(), current.Location())
			}
		}

	case "yearly":
		targetMonth := baseEvent.StartDate.Month()
		targetDay := baseEvent.StartDate.Day()
		for current.Before(recurrenceEnd) || current.Equal(recurrenceEnd) {
			if current.Month() == targetMonth && current.Day() == targetDay {
				if (current.After(start) || current.Equal(start)) && (current.Before(end) || current.Equal(end)) {
					occurrence := s.createOccurrence(baseEvent, current)
					occurrences = append(occurrences, occurrence)
				}
			}
			current = current.AddDate(1, 0, 0)
		}
	}

	return occurrences
}

// createOccurrence creates a single occurrence from a base event
func (s *eventService) createOccurrence(baseEvent *entities.Event, occurrenceDate time.Time) *entities.Event {
	occurrence := *baseEvent // Copy base event

	// Adjust dates
	occurrence.StartDate = occurrenceDate

	if baseEvent.EndDate != nil {
		duration := baseEvent.EndDate.Sub(baseEvent.StartDate)
		endDate := occurrenceDate.Add(duration)
		occurrence.EndDate = &endDate
	}

	return &occurrence
}

// applyExceptions applies exceptions (deleted/modified) to occurrences
func (s *eventService) applyExceptions(occurrences []*entities.Event, exceptions []*entities.EventException) []*entities.Event {
	var result []*entities.Event

	for _, occurrence := range occurrences {
		isDeleted := false

		for _, exception := range exceptions {
			// Check if this occurrence matches the exception date
			if occurrence.StartDate.Equal(exception.OriginalDate) {
				if exception.Type == "deleted" {
					isDeleted = true
					break
				} else if exception.Type == "modified" {
					// Apply modifications
					if exception.ModifiedTitle != nil {
						occurrence.Title = *exception.ModifiedTitle
					}
					if exception.ModifiedStartDate != nil {
						occurrence.StartDate = *exception.ModifiedStartDate
					}
					if exception.ModifiedEndDate != nil {
						occurrence.EndDate = exception.ModifiedEndDate
					}
					if exception.ModifiedDomain != nil {
						occurrence.Domain = *exception.ModifiedDomain
					}
					if exception.ModifiedAllDay != nil {
						occurrence.AllDay = *exception.ModifiedAllDay
					}
					break
				}
			}
		}

		if !isDeleted {
			result = append(result, occurrence)
		}
	}

	return result
}

// UpdateEvent updates an event (with edit scope: "this", "following", "all")
func (s *eventService) UpdateEvent(eventID, userID uuid.UUID, occurrenceDate *time.Time, editScope string,
	title string, startDate time.Time, endDate *time.Time, allDay bool, domain string,
	recurrenceType *string, recurrenceEnd *time.Time, recurrenceDays *string, hideFromAgenda bool) (*entities.Event, error) {

	// Get base event and verify ownership
	baseEvent, err := s.GetEvent(eventID, userID)
	if err != nil {
		return nil, err
	}

	// Validate edit scope
	if editScope != "this" && editScope != "following" && editScope != "all" {
		return nil, errors.New("invalid edit scope")
	}

	// For non-recurring events, only "all" scope makes sense
	if !baseEvent.IsRecurring && editScope != "all" {
		return nil, errors.New("non-recurring events can only use 'all' scope")
	}

	switch editScope {
	case "this":
		// Create exception for this occurrence
		if occurrenceDate == nil {
			return nil, errors.New("occurrence date is required for 'this' scope")
		}

		exception := &entities.EventException{
			ID:           uuid.New(),
			EventID:      eventID,
			UserID:       userID,
			OriginalDate: *occurrenceDate,
			Type:         "modified",
			CreatedAt:    time.Now(),
		}

		// Set modified fields
		if title != baseEvent.Title {
			exception.ModifiedTitle = &title
		}
		if !startDate.Equal(baseEvent.StartDate) {
			exception.ModifiedStartDate = &startDate
		}
		if endDate != nil && !endDate.Equal(*baseEvent.EndDate) {
			exception.ModifiedEndDate = endDate
		}
		if domain != baseEvent.Domain {
			exception.ModifiedDomain = &domain
		}
		if allDay != baseEvent.AllDay {
			exception.ModifiedAllDay = &allDay
		}

		err := s.eventRepo.CreateEventException(exception)
		if err != nil {
			return nil, err
		}

		return baseEvent, nil

	case "following":
		// End current recurrence at the day before occurrence
		if occurrenceDate == nil {
			return nil, errors.New("occurrence date is required for 'following' scope")
		}

		dayBefore := occurrenceDate.AddDate(0, 0, -1)
		baseEvent.RecurrenceEnd = &dayBefore
		baseEvent.UpdatedAt = time.Now()

		err := s.eventRepo.UpdateEvent(baseEvent)
		if err != nil {
			return nil, err
		}

		// Create new recurring event starting from occurrence date
		newEvent := &entities.Event{
			ID:             uuid.New(),
			UserID:         userID,
			Title:          title,
			StartDate:      startDate,
			EndDate:        endDate,
			AllDay:         allDay,
			Domain:         domain,
			IsRecurring:    true,
			RecurrenceType: recurrenceType,
			RecurrenceEnd:  recurrenceEnd,
			RecurrenceDays: recurrenceDays,
			HideFromAgenda: hideFromAgenda,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		}

		err = s.eventRepo.CreateEvent(newEvent)
		if err != nil {
			return nil, err
		}

		return newEvent, nil

	case "all":
		// Update base event directly
		baseEvent.Title = title
		baseEvent.StartDate = startDate
		baseEvent.EndDate = endDate
		baseEvent.AllDay = allDay
		baseEvent.Domain = domain
		baseEvent.RecurrenceType = recurrenceType
		baseEvent.RecurrenceEnd = recurrenceEnd
		baseEvent.RecurrenceDays = recurrenceDays
		baseEvent.HideFromAgenda = hideFromAgenda
		baseEvent.UpdatedAt = time.Now()

		err := s.eventRepo.UpdateEvent(baseEvent)
		if err != nil {
			return nil, err
		}

		return baseEvent, nil

	default:
		return nil, errors.New("invalid edit scope")
	}
}

// DeleteEvent deletes an event (with delete scope: "this", "following", "all")
func (s *eventService) DeleteEvent(eventID, userID uuid.UUID, occurrenceDate *time.Time, deleteScope string) error {
	// Get base event and verify ownership
	baseEvent, err := s.GetEvent(eventID, userID)
	if err != nil {
		return err
	}

	// Validate delete scope
	if deleteScope != "this" && deleteScope != "following" && deleteScope != "all" {
		return errors.New("invalid delete scope")
	}

	// For non-recurring events, only "all" scope makes sense
	if !baseEvent.IsRecurring && deleteScope != "all" {
		return errors.New("non-recurring events can only use 'all' scope")
	}

	switch deleteScope {
	case "this":
		// Create exception for this occurrence
		if occurrenceDate == nil {
			return errors.New("occurrence date is required for 'this' scope")
		}

		exception := &entities.EventException{
			ID:           uuid.New(),
			EventID:      eventID,
			UserID:       userID,
			OriginalDate: *occurrenceDate,
			Type:         "deleted",
			CreatedAt:    time.Now(),
		}

		return s.eventRepo.CreateEventException(exception)

	case "following":
		// End recurrence at the day before occurrence
		if occurrenceDate == nil {
			return errors.New("occurrence date is required for 'following' scope")
		}

		dayBefore := occurrenceDate.AddDate(0, 0, -1)
		baseEvent.RecurrenceEnd = &dayBefore
		baseEvent.UpdatedAt = time.Now()

		return s.eventRepo.UpdateEvent(baseEvent)

	case "all":
		// Delete entire event
		return s.eventRepo.DeleteEvent(eventID)

	default:
		return errors.New("invalid delete scope")
	}
}

// CheckConflict checks if event conflicts with existing events (only for non-all-day)
func (s *eventService) CheckConflict(userID uuid.UUID, startDate time.Time, endDate *time.Time, allDay bool, excludeEventID *uuid.UUID) (bool, error) {
	// Skip conflict check for all-day events
	if allDay {
		return false, nil
	}

	// Skip if no end date
	if endDate == nil {
		return false, nil
	}

	// Get events in the same time range
	rangeStart := startDate.AddDate(0, 0, -1)
	rangeEnd := endDate.AddDate(0, 0, 1)

	events, err := s.eventRepo.FindEventsByUserIDAndDateRange(userID, rangeStart, rangeEnd)
	if err != nil {
		return false, err
	}

	for _, event := range events {
		// Skip the event we're excluding (for updates)
		if excludeEventID != nil && event.ID == *excludeEventID {
			continue
		}

		// Skip all-day events
		if event.AllDay {
			continue
		}

		// Skip if no end date
		if event.EndDate == nil {
			continue
		}

		// Check for overlap
		// Events overlap if: start1 < end2 AND start2 < end1
		if startDate.Before(*event.EndDate) && event.StartDate.Before(*endDate) {
			return true, nil
		}
	}

	return false, nil
}
