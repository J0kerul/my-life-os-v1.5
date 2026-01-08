package service

import (
	"errors"
	"time"

	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/entities"
	"github.com/J0kerul/my-life-os-v1.5/my-life-os-backend/internal/domain/interfaces"
	"gorm.io/gorm"

	"github.com/google/uuid"
)

type routineService struct {
	routineRepo interfaces.RoutineRepository
}

// NewRoutineService creates a new routine service
func NewRoutineService(routineRepo interfaces.RoutineRepository) interfaces.RoutineService {
	return &routineService{
		routineRepo: routineRepo,
	}
}

// CreateRoutine creates a new routine
func (s *routineService) CreateRoutine(
	userID uuid.UUID,
	title, frequency string,
	weekday, dayOfMonth, quarterlyDay *int,
	yearlyDate *entities.YearlyDate,
	isSkippable, showStreak bool,
	timeType string,
	specificTime *string,
) (*entities.Routine, error) {
	// Validate required fields
	if title == "" {
		return nil, errors.New("title is required")
	}

	// Validate frequency
	validFrequencies := []string{"Daily", "Weekly", "Monthly", "Quarterly", "Yearly"}
	isFrequencyValid := false
	for _, f := range validFrequencies {
		if frequency == f {
			isFrequencyValid = true
			break
		}
	}
	if !isFrequencyValid {
		return nil, errors.New("invalid frequency")
	}

	// Validate frequency-specific fields
	if err := s.validateFrequencyFields(frequency, weekday, dayOfMonth, quarterlyDay, yearlyDate); err != nil {
		return nil, err
	}

	// Validate timeType
	validTimeTypes := []string{"AM", "PM", "AllDay", "Specific"}
	isTimeTypeValid := false
	for _, t := range validTimeTypes {
		if timeType == t {
			isTimeTypeValid = true
			break
		}
	}
	if !isTimeTypeValid {
		return nil, errors.New("invalid timeType")
	}

	// Validate specificTime if timeType is Specific
	if timeType == "Specific" && (specificTime == nil || *specificTime == "") {
		return nil, errors.New("specificTime is required when timeType is Specific")
	}

	// Create routine
	routine := &entities.Routine{
		ID:            uuid.New(),
		UserID:        userID,
		Title:         title,
		Frequency:     frequency,
		Weekday:       weekday,
		DayOfMonth:    dayOfMonth,
		QuarterlyDay:  quarterlyDay,
		YearlyDate:    yearlyDate,
		IsSkippable:   isSkippable,
		ShowStreak:    showStreak,
		TimeType:      timeType,
		SpecificTime:  specificTime,
		CurrentStreak: 0,
		LongestStreak: 0,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	err := s.routineRepo.CreateRoutine(routine)
	if err != nil {
		return nil, err
	}

	return routine, nil
}

// GetRoutine retrieves a single routine (ensures user owns it)
func (s *routineService) GetRoutine(routineID, userID uuid.UUID) (*entities.Routine, error) {
	routine, err := s.routineRepo.GetRoutineByID(routineID)
	if err != nil {
		return nil, err
	}

	// Verify ownership
	if routine.UserID != userID {
		return nil, errors.New("unauthorized: routine does not belong to user")
	}

	return routine, nil
}

// GetRoutines retrieves all routines for a user with optional frequency filter
func (s *routineService) GetRoutines(userID uuid.UUID, frequency *string) ([]*entities.Routine, error) {
	return s.routineRepo.GetRoutinesByUserID(userID, frequency)
}

// UpdateRoutine updates an existing routine
func (s *routineService) UpdateRoutine(
	routineID, userID uuid.UUID,
	title, frequency *string,
	weekday, dayOfMonth, quarterlyDay *int,
	yearlyDate *entities.YearlyDate,
	isSkippable, showStreak *bool,
	timeType, specificTime *string,
) (*entities.Routine, error) {
	// Get existing routine
	routine, err := s.GetRoutine(routineID, userID)
	if err != nil {
		return nil, err
	}

	// Update fields if provided
	if title != nil && *title != "" {
		routine.Title = *title
	}

	if frequency != nil && *frequency != "" {
		// Validate frequency
		validFrequencies := []string{"Daily", "Weekly", "Monthly", "Quarterly", "Yearly"}
		isValid := false
		for _, f := range validFrequencies {
			if *frequency == f {
				isValid = true
				break
			}
		}
		if !isValid {
			return nil, errors.New("invalid frequency")
		}
		routine.Frequency = *frequency
	}

	// Update frequency-specific fields
	if weekday != nil {
		routine.Weekday = weekday
	}
	if dayOfMonth != nil {
		routine.DayOfMonth = dayOfMonth
	}
	if quarterlyDay != nil {
		routine.QuarterlyDay = quarterlyDay
	}
	if yearlyDate != nil {
		routine.YearlyDate = yearlyDate
	}

	// Validate updated frequency fields
	if err := s.validateFrequencyFields(routine.Frequency, routine.Weekday, routine.DayOfMonth, routine.QuarterlyDay, routine.YearlyDate); err != nil {
		return nil, err
	}

	if isSkippable != nil {
		routine.IsSkippable = *isSkippable
	}
	if showStreak != nil {
		routine.ShowStreak = *showStreak
	}

	if timeType != nil && *timeType != "" {
		validTimeTypes := []string{"AM", "PM", "AllDay", "Specific"}
		isValid := false
		for _, t := range validTimeTypes {
			if *timeType == t {
				isValid = true
				break
			}
		}
		if !isValid {
			return nil, errors.New("invalid timeType")
		}
		routine.TimeType = *timeType
	}

	if specificTime != nil {
		routine.SpecificTime = specificTime
	}

	// Validate specificTime if timeType is Specific
	if routine.TimeType == "Specific" && (routine.SpecificTime == nil || *routine.SpecificTime == "") {
		return nil, errors.New("specificTime is required when timeType is Specific")
	}

	routine.UpdatedAt = time.Now()

	err = s.routineRepo.UpdateRoutine(routine)
	if err != nil {
		return nil, err
	}

	return routine, nil
}

// DeleteRoutine deletes a routine
func (s *routineService) DeleteRoutine(routineID, userID uuid.UUID) error {
	// Verify ownership first
	_, err := s.GetRoutine(routineID, userID)
	if err != nil {
		return err
	}

	return s.routineRepo.DeleteRoutine(routineID)
}

// CompleteRoutine marks a routine as completed for today and updates streak
func (s *routineService) CompleteRoutine(routineID, userID uuid.UUID) error {
	// Get routine and verify ownership
	routine, err := s.GetRoutine(routineID, userID)
	if err != nil {
		return err
	}

	today := time.Now()
	todayDate := time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, time.UTC)

	// Check if already completed/skipped today
	existingCompletion, err := s.routineRepo.GetCompletionForDate(routineID, todayDate)
	if err != nil && err != gorm.ErrRecordNotFound {
		return err
	}
	if existingCompletion != nil {
		return errors.New("routine already completed or skipped today")
	}

	// Record completion
	completion := &entities.RoutineCompletion{
		ID:          uuid.New(),
		RoutineID:   routineID,
		UserID:      userID,
		CompletedAt: todayDate,
		Status:      "completed",
		CreatedAt:   time.Now(),
	}

	err = s.routineRepo.RecordCompletion(completion)
	if err != nil {
		return err
	}

	// Calculate and update streak
	newStreak := s.calculateStreak(routine, todayDate)
	longestStreak := routine.LongestStreak
	if newStreak > longestStreak {
		longestStreak = newStreak
	}

	err = s.routineRepo.UpdateStreak(routineID, newStreak, longestStreak)
	if err != nil {
		return err
	}

	return nil
}

// SkipRoutine marks a routine as skipped for today (preserves streak if isSkippable=true)
func (s *routineService) SkipRoutine(routineID, userID uuid.UUID) error {
	// Get routine and verify ownership
	routine, err := s.GetRoutine(routineID, userID)
	if err != nil {
		return err
	}

	today := time.Now()
	todayDate := time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, time.UTC)

	// Check if already completed/skipped today
	existingCompletion, err := s.routineRepo.GetCompletionForDate(routineID, todayDate)
	if err != nil && err != gorm.ErrRecordNotFound {
		return err
	}
	if existingCompletion != nil {
		return errors.New("routine already completed or skipped today")
	}

	// Record skip
	completion := &entities.RoutineCompletion{
		ID:          uuid.New(),
		RoutineID:   routineID,
		UserID:      userID,
		CompletedAt: todayDate,
		Status:      "skipped",
		CreatedAt:   time.Now(),
	}

	err = s.routineRepo.RecordCompletion(completion)
	if err != nil {
		return err
	}

	// If not skippable, reset streak to 0
	if !routine.IsSkippable {
		err = s.routineRepo.UpdateStreak(routineID, 0, routine.LongestStreak)
		if err != nil {
			return err
		}
	}
	// If skippable, streak is preserved (no update needed)

	return nil
}

// GetTodaysRoutines retrieves routines that are relevant for today based on frequency
func (s *routineService) GetTodaysRoutines(userID uuid.UUID) ([]*entities.Routine, error) {
	// Get all user routines
	allRoutines, err := s.routineRepo.GetRoutinesByUserID(userID, nil)
	if err != nil {
		return nil, err
	}

	today := time.Now()
	var todaysRoutines []*entities.Routine

	for _, routine := range allRoutines {
		if s.matchesFrequency(routine, today) {
			todaysRoutines = append(todaysRoutines, routine)
		}
	}

	return todaysRoutines, nil
}

// validateFrequencyFields validates that required fields for each frequency are set
func (s *routineService) validateFrequencyFields(
	frequency string,
	weekday, dayOfMonth, quarterlyDay *int,
	yearlyDate *entities.YearlyDate,
) error {
	switch frequency {
	case "Daily":
		// No additional fields required
		return nil

	case "Weekly":
		if weekday == nil {
			return errors.New("weekday is required for Weekly frequency")
		}
		if *weekday < 0 || *weekday > 6 {
			return errors.New("weekday must be between 0 (Sunday) and 6 (Saturday)")
		}
		return nil

	case "Monthly":
		if dayOfMonth == nil {
			return errors.New("dayOfMonth is required for Monthly frequency")
		}
		if *dayOfMonth < 1 || *dayOfMonth > 31 {
			return errors.New("dayOfMonth must be between 1 and 31")
		}
		return nil

	case "Quarterly":
		if quarterlyDay == nil {
			return errors.New("quarterlyDay is required for Quarterly frequency")
		}
		if *quarterlyDay < 1 || *quarterlyDay > 31 {
			return errors.New("quarterlyDay must be between 1 and 31")
		}
		return nil

	case "Yearly":
		if yearlyDate == nil {
			return errors.New("yearlyDate is required for Yearly frequency")
		}
		if yearlyDate.Month < 1 || yearlyDate.Month > 12 {
			return errors.New("yearlyDate.month must be between 1 and 12")
		}
		if yearlyDate.Day < 1 || yearlyDate.Day > 31 {
			return errors.New("yearlyDate.day must be between 1 and 31")
		}
		return nil

	default:
		return errors.New("invalid frequency")
	}
}

// matchesFrequency checks if a routine should be shown on a given date
func (s *routineService) matchesFrequency(routine *entities.Routine, date time.Time) bool {
	switch routine.Frequency {
	case "Daily":
		return true

	case "Weekly":
		if routine.Weekday == nil {
			return false
		}
		return int(date.Weekday()) == *routine.Weekday

	case "Monthly":
		if routine.DayOfMonth == nil {
			return false
		}
		return date.Day() == *routine.DayOfMonth

	case "Quarterly":
		if routine.QuarterlyDay == nil {
			return false
		}
		// Check if current month is a quarter start (Jan=1, Apr=4, Jul=7, Oct=10)
		month := int(date.Month())
		isQuarterStart := (month == 1 || month == 4 || month == 7 || month == 10)
		return isQuarterStart && date.Day() == *routine.QuarterlyDay

	case "Yearly":
		if routine.YearlyDate == nil {
			return false
		}
		return int(date.Month()) == routine.YearlyDate.Month && date.Day() == routine.YearlyDate.Day

	default:
		return false
	}
}

// calculateStreak calculates the current streak based on completion history
func (s *routineService) calculateStreak(routine *entities.Routine, upToDate time.Time) int {
	streak := 1 // Today's completion counts as 1

	// Get expected dates going backwards from yesterday
	checkDate := upToDate.AddDate(0, 0, -1) // Start from yesterday

	for i := 0; i < 365; i++ { // Max 365 days lookback
		// Check if this date should have been a routine day
		if !s.matchesFrequency(routine, checkDate) {
			checkDate = checkDate.AddDate(0, 0, -1)
			continue
		}

		// Check if routine was completed or skipped on this date
		completion, err := s.routineRepo.GetCompletionForDate(routine.ID, checkDate)

		// No completion found - streak breaks (unless it's today)
		if err != nil || completion == nil {
			break
		}

		// Completed - streak continues
		if completion.Status == "completed" {
			streak++
			checkDate = checkDate.AddDate(0, 0, -1)
			continue
		}

		// Skipped and routine is skippable - streak continues
		if completion.Status == "skipped" && routine.IsSkippable {
			checkDate = checkDate.AddDate(0, 0, -1)
			continue
		}

		// Skipped but routine is NOT skippable - streak breaks
		if completion.Status == "skipped" && !routine.IsSkippable {
			break
		}

		checkDate = checkDate.AddDate(0, 0, -1)
	}

	return streak
}
