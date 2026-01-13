# MyLifeOS v1.5 - Stand der Implementierung

## 🛠️ Tech Stack

### Frontend Framework & Core

- **Next.js 16.1.1** (App Router) - React Framework
- **React 19.2.3** - UI Library
- **TypeScript 5** - Type Safety
- **Tailwind CSS 4** - Modern Styling Framework

### UI & Animation Libraries

- **Framer Motion 12.23.26** - Animations und Transitions
- **Radix UI** - Accessible UI Components (Dialog, Label, Popover, Select, Slot)
- **Lucide React 0.562.0** - Icon System
- **class-variance-authority** - Component Variants
- **tailwind-merge & clsx** - Class Management

### Rich Text & Content

- **TipTap 3.14.0** - Rich Text Editor (installiert, noch nicht verwendet)
  - Extension: Task Items & Task Lists
  - Starter Kit

### State Management

- **Zustand 5.0.9** - Global State mit Persist Middleware

### Date & Time

- **date-fns 4.1.0** - Date Utilities
- **react-day-picker 9.13.0** - Calendar Component

### Utilities

- **UUID 13.0.0** - Unique IDs
- **tw-animate-css** - Additional Animations

### Backend

- **Language**: Go 1.23
- **Framework**: Fiber (Fast HTTP framework)
- **Database**: PostgreSQL 16
- **ORM**: GORM (mit AutoMigrate)
- **Authentication**: JWT with dual tokens (Access + Refresh)
- **Containerization**: Docker + Docker Compose
- **Architecture**: Clean Architecture with interfaces

---

## 🎨 Design System

### Farbschema: "Deep Space Dark Mode"

```css
--background: #050505       (Ultra Dark)
--foreground: #e8e8e8       (Light Text)
--card: #121418             (Card Background)
--border: #202329           (Subtle Borders)
--primary: #6366f1          (Indigo Primary)
--muted-foreground: #9ca3af (Muted Text)
```

### Design-Prinzipien

- ✨ **Glassmorphism** - Transparente, verschwommene Effekte (für Overlays)
- 🎨 **Clean & Minimal** - Keine übermäßigen Gradienten in Komponenten
- 🔄 **Micro-Animations** - Smooth Transitions mit Framer Motion
- 📱 **Responsive Grid** - 3-Column Dashboard Layout
- 🌙 **Dark-First Design** - Optimiert für dunkle Themes

### Typografie

- **Font**: Inter (Google Fonts) mit Font Features (cv11, ss01)
- **Custom Scrollbar** - Styled für Dark Mode

---

## 📂 Projektstruktur

### Backend

```
my-life-os-backend/
├── cmd/server/
│   └── main.go                         # Application entry point + AutoMigrate
├── internal/
│   ├── config/
│   │   └── config.go                   # Configuration management (env vars)
│   ├── database/
│   │   └── postgres.go                 # Database connection & AutoMigrate function
│   ├── domain/
│   │   ├── entities/                   # Domain models (GORM creates tables from these)
│   │   │   ├── user.go
│   │   │   ├── refresh_token.go
│   │   │   ├── task.go
│   │   │   ├── routine.go
│   │   │   └── routine_completion.go
│   │   └── interfaces/                 # Interface definitions
│   │       ├── repositories.go         # Repository interfaces
│   │       └── services.go             # Service interfaces
│   ├── repository/postgres/            # Data access layer
│   │   ├── user_repository.go
│   │   ├── token_repository.go
│   │   ├── task_repository.go
│   │   └── routine_repository.go
│   ├── service/                        # Business logic
│   │   ├── auth_service.go
│   │   ├── task_service.go
│   │   └── routine_service.go
│   ├── handler/http/                   # HTTP handlers
│   │   ├── auth_handler.go
│   │   ├── task_handler.go
│   │   └── routine_handler.go
│   └── middleware/                     # Auth & rate limiting
│       ├── auth.go
│       └── rate_limiter.go
├── docker-compose.yml
├── Dockerfile
├── .env
└── go.mod
```

### Frontend

```
my-life-os-frontend/
├── app/
│   ├── layout.tsx                      # Root Layout mit Sidebar
│   ├── page.tsx                        # Landing page (redirects)
│   ├── globals.css                     # Design System & Utilities
│   ├── setup/page.tsx                  # Initial user setup
│   ├── login/page.tsx                  # Login page
│   ├── dashboard/page.tsx              # Dashboard Homepage
│   ├── tasks/
│   │   └── page.tsx                    # Task Management Seite
│   └── routines/
│       └── page.tsx                    # Daily Routines Seite
│
├── components/
│   ├── auth-guard.tsx                  # Protected route wrapper
│   ├── sidebar.tsx                     # Sliding Overlay Navigation
│   ├── burger-menu.tsx                 # Mobile Menu Toggle
│   │
│   ├── dashboard/
│   │   ├── weekly-task-board.tsx       # Task Widget für Dashboard
│   │   └── todays-routines-widget.tsx  # Daily Routines Widget
│   │
│   ├── tasks/
│   │   ├── quick-add-dialog.tsx        # Schnelles Task Erstellen
│   │   ├── task-detail-view.tsx        # Detailansicht (Rechts)
│   │   ├── task-detail-modal.tsx       # Modal für Dashboard Widget
│   │   ├── task-list.tsx               # Task Liste
│   │   ├── task-item.tsx               # Einzelner Task in Liste
│   │   └── task-filter-sidebar.tsx     # Domain/Time/Status Filter
│   │
│   └── routines/
│       ├── quick-add-dialog.tsx        # Schnelles Routine Erstellen
│       ├── routine-detail-view.tsx     # Detailansicht (Rechts)
│       ├── routines-list.tsx           # Routine Liste
│       ├── routine-item.tsx            # Einzelne Routine in Liste
│       └── routine-filter-sidebar.tsx  # Frequency Filter
│
├── lib/
│   ├── utils.ts                        # Utility functions
│   ├── api/
│   │   ├── auth.ts                     # Auth API functions
│   │   ├── tasks.ts                    # Task API functions
│   │   └── routines.ts                 # Routine API functions
│   └── store/
│       ├── auth-store.ts               # Zustand auth state
│       ├── task-store.ts               # Zustand Task State Management
│       └── routine-store.ts            # Zustand Routine State Management
│
└── types/
    └── index.ts                        # All Type Definitions
```

---

## 🏗️ Backend Architecture (Clean Architecture)

### Layer Structure

#### 1. Config Layer (`internal/config/`)

- `config.go`: Loads environment variables
- Configuration struct:
  - `DatabaseURL`: PostgreSQL connection string
  - `JWTSecret`: Secret for JWT signing
  - `Port`: Server port
  - `Environment`: dev/production

#### 2. Database Layer (`internal/database/`)

- `postgres.go`: Database connection & migration management
- `Connect(url)`: Establishes PostgreSQL connection with GORM
- `AutoMigrate(db, models...)`: Runs GORM auto-migrations for entities

**Important**: GORM creates tables automatically from entity structs

- No SQL migration files needed
- Schema changes happen automatically
- Tables created/updated on server startup

**Current entities:**

- User
- RefreshToken
- Task
- Routine
- RoutineCompletion

```go
type Routine struct {
    ID          uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
    UserID      uuid.UUID `gorm:"type:uuid;not null" json:"userId"`
    Title       string    `gorm:"type:varchar(255);not null" json:"title"`
    // GORM uses these tags to create the table
}
```

#### 3. Domain Layer (`internal/domain/`)

**Entities:**

- Pure Go structs representing business objects
- GORM tags define table structure
- JSON tags for API serialization

**Interfaces:**

- `repositories.go`: Repository interface definitions
- `services.go`: Service interface definitions
- Define contracts between layers

#### 4. Repository Layer (`internal/repository/postgres/`)

- Implements repository interfaces
- Direct database interaction using GORM
- Pure data access - no business logic

#### 5. Service Layer (`internal/service/`)

- Implements service interfaces
- Contains all business logic
- Orchestrates repository calls
- Validates data and applies business rules

#### 6. Handler Layer (`internal/handler/http/`)

- HTTP request/response handling
- Input validation
- Calls service layer methods
- Returns JSON responses

#### 7. Middleware Layer (`internal/middleware/`)

- `auth.go`: JWT validation, user context injection
- `rate_limiter.go`: Rate limiting for different endpoint types

### Dependency Flow

```
Handler → Service (interface) → Repository (interface) → Database
   ↓
Middleware
```

### Database Migrations

**GORM AutoMigrate:**

```go
// In cmd/server/main.go
database.AutoMigrate(db,
    &entities.User{},
    &entities.RefreshToken{},
    &entities.Task{},
    &entities.Routine{},
    &entities.RoutineCompletion{}
)
```

- GORM analyzes entity structs
- Creates tables if they don't exist
- Updates schema if structs changed
- Runs automatically on server startup
- No manual SQL migration files

---

## ✅ Implementierte Features

### 1. Authentication System (Sprint 2)

#### Backend:

- Dual-token JWT authentication (Access token + Refresh token)
- Access tokens: 15min expiry, stored in memory only
- Refresh tokens: 7-day expiry, HttpOnly cookies, rotation on use
- Rate limiting on auth endpoints
- Password hashing with bcrypt
- Initial setup flow for first user creation

#### Frontend:

- Login page with form validation
- Setup page for first-time initialization
- Auth guard for protected routes
- Automatic token refresh
- Logout functionality
- Auth state management with Zustand

#### API Endpoints:

```
GET  /api/status              - Check if setup needed
POST /api/setup               - Create first user
POST /api/auth/login          - Login
POST /api/auth/refresh        - Refresh access token
POST /api/auth/logout         - Logout (invalidate refresh token)
GET  /api/auth/me             - Get current user
```

---

### 2. Task Management System (Sprint 3)

#### Backend Implementation

**Entity Definition** (`internal/domain/entities/task.go`):

```go
type Task struct {
    ID          uuid.UUID   `gorm:"type:uuid;primary_key" json:"id"`
    UserID      uuid.UUID   `gorm:"type:uuid;not null" json:"userId"`
    Title       string      `gorm:"type:varchar(255);not null" json:"title"`
    Description string      `gorm:"type:text" json:"description"`
    Priority    string      `gorm:"type:varchar(50);not null" json:"priority"`
    Domain      string      `gorm:"type:varchar(100);not null" json:"domain"`
    Deadline    *time.Time  `gorm:"type:timestamp" json:"deadline"`
    Status      string      `gorm:"type:varchar(50);not null" json:"status"`
    CreatedAt   time.Time   `gorm:"not null" json:"createdAt"`
    UpdatedAt   time.Time   `gorm:"not null" json:"updatedAt"`
}
```

- GORM creates `tasks` table from this struct
- No SQL migration file needed

**Service Layer Logic:**

- Complete CRUD operations
- Advanced filtering by Domain, Status, and Time
- Smart date-based filtering:
  - **Today**: Tasks with deadline on current day
  - **Tomorrow**: Tasks with deadline on next day
  - **Next Week**: Tasks with deadline in next 7 days
  - **Next Month**: Tasks with deadline in next 30 days
  - **Long Term**: Tasks without deadline OR deadline > 30 days
- Deadline sorting (closest deadlines first)
- Status toggle functionality

**API Endpoints:**

```
GET    /api/tasks              - Get tasks with filters
       ?domain=Work            - Filter by domain
       &status=Todo            - Filter by status
       &time=today             - Filter by time range
POST   /api/tasks              - Create new task
GET    /api/tasks/:id          - Get single task
PUT    /api/tasks/:id          - Update task
PATCH  /api/tasks/:id/status   - Toggle task status (Todo ↔ Done)
DELETE /api/tasks/:id          - Delete task
```

#### Frontend Implementation

**Page Layout** (`/tasks`):

```
┌─────────────┬────────────────────┬──────────────┐
│   Sidebar   │     Task List      │ Detail View  │
│  (Filters)  │  (with New Task)   │   (Always)   │
│   280px     │       1fr          │    450px     │
└─────────────┴────────────────────┴──────────────┘
```

**Filter Sidebar** (`task-filter-sidebar.tsx`):

- **Domain Filters:**

  - Work, University, Coding Project, Personal Project, Goals, Finances, Household, Health

- **Time Filters:**

  - All Tasks (null), Long Term, Today, Tomorrow, Next Week, Next Month

- **Completion Filter:**

  - Two toggle buttons: "To do" / "Done"
  - Default: null (shows all tasks)

- **Active Filters Display:**
  - Shows applied filters as chips
  - Each chip has remove button
  - "Clear all filters" button

**Task List** (`task-list.tsx`):

- **Grouping Logic** (when time filter = "All Tasks"):

  - ⏰ **Time Sensitive**: Tasks WITH deadlines
  - 📋 **Long Term**: Tasks WITHOUT deadlines

- **Sorting within Groups:**

  - Todo tasks appear first
  - Done tasks appear last
  - Within same status: sorted by deadline (closest first)

- **Progress Stats:**

  - Shows "X / Y completed"
  - Shows percentage

- **New Task Button:**
  - Opens Quick Add Dialog

**Task Item** (`task-item.tsx`):

- Checkbox for status toggle
- Priority icon with color (High: ↑ red, Medium: − yellow, Low: ↓ green)
- Title (with strikethrough if Done)
- Domain label
- Deadline display with smart formatting
- Click anywhere → Selects task for detail view

**Deadline Formatting Logic:**

`isOverdue()` utility:

- Returns `true` ONLY if deadline is BEFORE today
- Today is NOT considered overdue

`formatDeadline()` utility returns: `{text, isRed, showOverdue}`

- **Today (0 days)**: "heute" | red text | NO overdue badge
- **Yesterday (-1 day)**: "gestern" | red text | overdue badge
- **Past (<-1 days)**: "5. Jan" | red text | overdue badge
- **Future (>0 days)**: "10. Jan" | normal | NO badge

**Task Detail View** (`task-detail-view.tsx`):

- Fixed right panel (450px, always visible)
- Shows selected task details
- **Layout:**

```
  Title
  ┌──────────┬──────────┐
  │ Priority │  Domain  │  (2 columns)
  └──────────┴──────────┘
  Deadline
  Description
  ┌──────────┬──────────┐
  │ Created  │ Updated  │  (2 columns)
  └──────────┴──────────┘
```

- **Edit Mode:**

  - Toggle edit mode with "Edit Task" button
  - All fields editable
  - Save/Cancel buttons
  - Delete button with confirmation

- NO "Mark as Done" button - use checkbox in list

**Quick Add Dialog** (`quick-add-dialog.tsx`):

- Modal for fast task creation
- Fields: Title (required), Priority dropdown, Domain dropdown, Deadline date picker
- Create button
- Closes on success

**State Management** (`task-store.ts`):

Interface:

```typescript
- tasks: Task[]
- isLoading: boolean
- selectedTask: Task | null
- domainFilter: TaskDomain | null
- statusFilter: TaskStatus | null
- timeFilter: TimeFilter | null
```

Actions:

- `fetchTasksWithFilters(domain?, status?, timeFilter?)`
- `createTask(data)`
- `updateTask(id, data)`
- `toggleTaskStatus(id)`
- `deleteTask(id)`
- `selectTask(task)`
- `setFilters(...)`
- `clearFilters()`

Persistence:

- localStorage key: `'task-storage'`
- Auto-saves on every change

**TypeScript Types** (`types/index.ts`):

```typescript
type TaskPriority = "Low" | "Medium" | "High";
type TaskStatus = "Todo" | "Done";
type TaskDomain =
  | "Work"
  | "University"
  | "Coding Project"
  | "Personal Project"
  | "Goals"
  | "Finances"
  | "Household"
  | "Health";
type TimeFilter =
  | "long_term"
  | "today"
  | "tomorrow"
  | "next_week"
  | "next_month";

interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  domain: TaskDomain;
  deadline?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}
```

---

### 3. Daily Routines System (Sprint 4)

#### Backend Implementation

**Entity Definition** (`internal/domain/entities/routine.go`):

```go
type YearlyDate struct {
    Month int `json:"month"` // 1-12
    Day   int `json:"day"`   // 1-31
}

type Routine struct {
    ID            uuid.UUID   `gorm:"type:uuid;primary_key" json:"id"`
    UserID        uuid.UUID   `gorm:"type:uuid;not null" json:"userId"`
    Title         string      `gorm:"type:varchar(255);not null" json:"title"`

    // Frequency settings
    Frequency     string      `gorm:"type:varchar(50);not null" json:"frequency"` // Daily, Weekly, Monthly, Quarterly, Yearly
    Weekday       *int        `gorm:"type:int" json:"weekday"`                    // 0-6 for Weekly (0=Sunday)
    DayOfMonth    *int        `gorm:"type:int" json:"dayOfMonth"`                 // 1-31 for Monthly
    QuarterlyDay  *int        `gorm:"type:int" json:"quarterlyDay"`               // 1-31 for Quarterly
    YearlyDate    *YearlyDate `gorm:"type:jsonb" json:"yearlyDate"`               // {month, day} for Yearly

    // Options
    IsSkippable   bool        `gorm:"not null;default:false" json:"isSkippable"`
    ShowStreak    bool        `gorm:"not null;default:false" json:"showStreak"`

    // Time settings
    TimeType      string      `gorm:"type:varchar(50);not null" json:"timeType"` // AM, PM, AllDay, Specific
    SpecificTime  *string     `gorm:"type:varchar(5)" json:"specificTime"`       // HH:mm format if TimeType=Specific

    // Streak tracking
    CurrentStreak int         `gorm:"not null;default:0" json:"currentStreak"`
    LongestStreak int         `gorm:"not null;default:0" json:"longestStreak"`

    // Timestamps
    CreatedAt     time.Time   `gorm:"not null" json:"createdAt"`
    UpdatedAt     time.Time   `gorm:"not null" json:"updatedAt"`
}
```

**Completion Entity** (`internal/domain/entities/routine_completion.go`):

```go
type RoutineCompletion struct {
    ID          uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
    RoutineID   uuid.UUID `gorm:"type:uuid;not null" json:"routineId"`
    UserID      uuid.UUID `gorm:"type:uuid;not null" json:"userId"`
    CompletedAt time.Time `gorm:"type:date;not null" json:"completedAt"`   // Date only, no time
    Status      string    `gorm:"type:varchar(50);not null" json:"status"` // "completed" or "skipped"
    CreatedAt   time.Time `gorm:"not null" json:"createdAt"`
}
```

- GORM creates `routines` and `routine_completions` tables from these structs
- No SQL migration files needed

**Service Layer Logic:**

- Complete CRUD operations for routines
- Frequency-based filtering (Daily, Weekly, Monthly, Quarterly, Yearly)
- **"Today's Routines"** matching logic:
  - **Daily**: Always shown
  - **Weekly**: Shown if weekday matches today
  - **Monthly**: Shown if day of month matches today
  - **Quarterly**: Shown if it's the right day in current quarter (Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec)
  - **Yearly**: Shown if month AND day match today
- Streak tracking system:
  - Increments `CurrentStreak` on daily completion
  - Updates `LongestStreak` if current exceeds longest
  - Resets `CurrentStreak` if a day is missed (no completion/skip)
- Completion/Skip functionality with deduplication (one action per day)

**API Endpoints:**

```
GET    /api/routines               - Get all routines (with optional ?frequency= filter)
GET    /api/routines/today         - Get routines matching today's date
GET    /api/routines/:id           - Get single routine
POST   /api/routines               - Create new routine
PUT    /api/routines/:id           - Update routine
DELETE /api/routines/:id           - Delete routine
POST   /api/routines/:id/complete  - Mark routine as completed for today
POST   /api/routines/:id/skip      - Mark routine as skipped for today
```

#### Frontend Implementation

**Page Layout** (`/routines`):

```
┌─────────────┬────────────────────┬──────────────┐
│   Sidebar   │   Routine List     │ Detail View  │
│  (Filters)  │  (with New Button) │   (Always)   │
│   280px     │       1fr          │    450px     │
└─────────────┴────────────────────┴──────────────┘
```

**Filter Sidebar** (`routine-filter-sidebar.tsx`):

- **Frequency Filters:**

  - All Routines (null)
  - Daily
  - Weekly
  - Monthly
  - Quarterly
  - Yearly

- **Active Filter Display:**
  - Shows current frequency filter
  - "Clear filter" button

**Routine List** (`routines-list.tsx`):

- Shows all routines (or filtered by frequency)
- Stats: "X routines" count
- New Routine button opens Quick Add Dialog

**Routine Item** (`routine-item.tsx`):

- **Frequency Badge** with color coding:

  - Daily: Blue
  - Weekly: Green
  - Monthly: Purple
  - Quarterly: Orange
  - Yearly: Pink

- **Routine Title**

- **Meta Information:**

  - Time Type icon & label (Morning/Evening/All Day/Specific Time)
  - "Skippable" indicator (if applicable)

- **Streak Display** (if ShowStreak enabled):

  - 🔥 Flame icon + current streak number

- Click anywhere → Selects routine for detail view
- Selected state: blue border + highlight

**Routine Detail View** (`routine-detail-view.tsx`):

- Fixed right panel (450px, always visible)
- Shows selected routine details

**Layout:**

```
  Title
  ┌──────────┬──────────┬──────────┐
  │Frequency │TimeType  │ Streak   │  (3 columns)
  └──────────┴──────────┴──────────┘

  Frequency-specific fields:
  - Weekly: Weekday selector
  - Monthly: Day selector (1-31)
  - Quarterly: Day selector (1-31)
  - Yearly: Month + Day selectors

  ┌──────────┬──────────┐
  │Skippable │ShowStreak│  (2 columns, checkboxes)
  └──────────┴──────────┘

  ┌──────────┬──────────┐
  │ Created  │ Updated  │  (2 columns, timestamps)
  └──────────┴──────────┘
```

**Edit Mode:**

- Toggle with "Edit Routine" button
- All fields editable (frequency-specific fields shown dynamically)
- Save/Cancel buttons
- Delete button with confirmation

**Quick Add Dialog** (`quick-add-dialog.tsx`):

- Modal for fast routine creation
- **Required Fields:**

  - Title (text input)
  - Frequency dropdown (Daily/Weekly/Monthly/Quarterly/Yearly)
  - Time Type dropdown (AM/PM/AllDay/Specific)

- **Conditional Fields** (based on Frequency):

  - **Weekly**: Weekday selector
  - **Monthly**: Day of month (1-31)
  - **Quarterly**: Day within quarter (1-31)
  - **Yearly**: Month + Day selectors

- **Optional Fields:**

  - Specific Time (HH:mm input, only if TimeType = "Specific")
  - Skippable checkbox
  - Show Streak checkbox

- Create button validates and submits
- Closes on success

**State Management** (`routine-store.ts`):

Interface:

```typescript
- routines: Routine[]
- selectedRoutine: Routine | null
- isLoading: boolean
- error: string | null
- frequencyFilter: RoutineFrequency | null
```

Actions:

- `fetchRoutines()` - Get all routines
- `fetchRoutinesWithFilter(frequency?)` - Get filtered routines
- `fetchTodaysRoutines()` - Get routines matching today
- `selectRoutine(routine)`
- `createRoutine(data)`
- `updateRoutine(id, data)`
- `completeRoutine(id)` - Mark completed for today
- `skipRoutine(id)` - Mark skipped for today
- `deleteRoutine(id)`
- `setFrequencyFilter(frequency)`
- `clearFilters()`

Persistence:

- localStorage key: `'routine-storage'`
- Auto-saves on every change

**TypeScript Types** (`types/index.ts`):

```typescript
type RoutineFrequency = "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly";
type RoutineTimeType = "AM" | "PM" | "AllDay" | "Specific";

interface YearlyDate {
  month: number; // 1-12
  day: number; // 1-31
}

interface Routine {
  id: string;
  userId: string;
  title: string;
  frequency: RoutineFrequency;
  weekday?: number; // 0-6 for Weekly
  dayOfMonth?: number; // 1-31 for Monthly
  quarterlyDay?: number; // 1-31 for Quarterly
  yearlyDate?: YearlyDate; // {month, day} for Yearly
  isSkippable: boolean;
  showStreak: boolean;
  timeType: RoutineTimeType;
  specificTime?: string; // HH:mm format
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateRoutineRequest {
  title: string;
  frequency: RoutineFrequency;
  weekday?: number;
  dayOfMonth?: number;
  quarterlyDay?: number;
  yearlyDate?: YearlyDate;
  isSkippable: boolean;
  showStreak: boolean;
  timeType: RoutineTimeType;
  specificTime?: string;
}

interface RoutineCompletion {
  id: string;
  routineId: string;
  userId: string;
  completedAt: string; // Date only (YYYY-MM-DD)
  status: "completed" | "skipped";
  createdAt: string;
}
```

---

### 4. Dashboard (`/dashboard`)

**Layout:**

- Dynamic greeting: "Guten Morgen/Tag/Abend/Noch wach, Alex"
- Current date in German: "Mittwoch, der 7. Januar 2026"
- Gradient header with decorative line
- 3-column grid layout for widgets
- Proper padding: `px-36 pr-16`

#### Weekly Task Board Widget (`weekly-task-board.tsx`)

**Header:**

- Blue clipboard icon (ClipboardCheck)
- "Task Manager" title (light gray/white)
- Task count badge (when collapsed)
- "+" button for Quick Add
- Expand/Collapse toggle

**Default State:** Collapsed

**When Expanded:**

- **Time Filter Only** (no Domain/Completion filters):

  - All Tasks, Today, Tomorrow, Next Week, Next Month, Long Term

- **Task Display:**

  - Shows ONLY Todo tasks (completed tasks hidden)
  - Checkbox to toggle completion
  - Priority icon, Domain, Deadline
  - Overdue badge when applicable

- **Stats:**

  - "X tasks to do"
  - "Y/Z completed" (overall completion ratio)

- **Click Task → Opens Modal:**
  - Centered modal with dark backdrop
  - Same functionality as detail view
  - **3-column layout for meta info:**

```
    ┌──────────┬──────────┬──────────┐
    │ Priority │  Domain  │ Deadline │
    └──────────┴──────────┴──────────┘
```

- Edit/Delete capabilities
- Close button + backdrop click to close

**Design:**

- NO gradient styling (unlike other future widgets)
- Single color icon (blue)
- Clean, simple aesthetic

#### Today's Routines Widget (`todays-routines-widget.tsx`)

**Header:**

- Green repeat icon (Repeat)
- "Today's Routines" title (light gray/white)
- Pending count badge (when collapsed)
- "+" button for Quick Add
- Expand/Collapse toggle

**Default State:** Collapsed

**When Expanded:**

- **Routines Display:**

  - Shows routines matching today's date (based on frequency logic)
  - Each routine item includes:
    - **Checkbox**: Click to mark completed
    - **Title**: Shows routine name (with strikethrough if done)
    - **Meta Info**:
      - Frequency label (Daily/Weekly/Monthly/etc.)
      - Current streak (if ShowStreak enabled): 🔥 X
      - "Skipped" indicator (if skipped today)
    - **Skip Button** (for skippable routines):
      - Green skip icon (SkipForward)
      - Only shown if routine is skippable AND not done yet

- **Status Handling:**

  - Completed routines: Gray checkmark + opacity 50%
  - Skipped routines: Amber "Skipped" label + opacity 50%
  - Pending routines: Full opacity, interactive

- **Stats:**

  - "X routines pending" (not completed/skipped)
  - "Y/Z done" (completed + skipped / total routines)

- **Empty State:**
  - "No routines for today! 🌟"
  - "Click + to add a new routine"

**Design:**

- Green theme (matching repeat icon)
- Simple, clean styling (no gradients)
- Scrollable list (max-height: 180px)

**Functionality:**

- Complete button: Calls `completeRoutine(id)` API
- Skip button: Calls `skipRoutine(id)` API
- Both actions update local state immediately
- Prevents duplicate actions (one per routine per day)
- Fetches today's routines on mount using `fetchTodaysRoutines()`

---

### 5. Navigation System

**Sidebar** (`sidebar.tsx`):

- Sliding overlay (280px wide)
- Glassmorphic design with backdrop blur
- Collapsible sections (6 main categories)

```
🏠 Home
  └── Dashboard

📊 Productivity & Uni
  ├── Tasks
  ├── Routines
  ├── Schedule
  ├── Projects
  └── University

📚 Knowledge & Growth
  ├── Notebook
  ├── Reflections
  └── Portfolio

🏃 Lifestyle & Health
  ├── Workout
  ├── Closet
  └── Recipes

💰 Finances & Goals
  ├── Finance
  ├── Wishlist
  └── Travel

🎬 Entertainment
  └── Media Library
```

**Burger Menu** (`burger-menu.tsx`):

- Fixed top-left position
- Opens sidebar on click
- Visible on all pages

---

## 🔑 Important Implementation Details

### Database Schema Management

**GORM AutoMigrate Approach:**

- Tables are created from entity structs at runtime
- Schema defined in Go code using GORM tags
- `main.go` calls `AutoMigrate()` on startup
- **Advantages:**
  - No separate SQL files to maintain
  - Schema changes happen automatically
  - Type-safe (Go structs = source of truth)

**Current entities:**

- User
- RefreshToken
- Task
- Routine
- RoutineCompletion

```go
type Routine struct {
    ID          uuid.UUID   `gorm:"type:uuid;primary_key" json:"id"`
    UserID      uuid.UUID   `gorm:"type:uuid;not null" json:"userId"`
    Title       string      `gorm:"type:varchar(255);not null" json:"title"`
    // GORM uses these tags to create the table
}
```

### Task Filtering Logic

**Backend Service Layer:**

```go
// Time filter logic
switch timeFilter {
case "today":
    Tasks with deadline on current day
case "tomorrow":
    Tasks with deadline on next day
case "next_week":
    Tasks with deadline in next 7 days
case "next_month":
    Tasks with deadline in next 30 days
case "long_term":
    Tasks without deadline OR deadline > 30 days
}
```

**Frontend Filter Combinations:**

- Multiple filters can be active simultaneously
- Domain + Status + Time filters work together
- Filters sent as query parameters to backend
- Backend service layer applies all filters

### Routines "Today" Matching Logic

**Backend Service Layer** (`GetTodaysRoutines`):

```go
now := time.Now()
weekday := int(now.Weekday())      // 0=Sunday, 6=Saturday
dayOfMonth := now.Day()            // 1-31
month := int(now.Month())          // 1-12

For each routine:
- Daily: Always include
- Weekly: Include if routine.Weekday == weekday
- Monthly: Include if routine.DayOfMonth == dayOfMonth
- Quarterly:
    - Determine current quarter (Q1-Q4)
    - Calculate day within quarter
    - Include if matches routine.QuarterlyDay
- Yearly: Include if routine.YearlyDate.Month == month AND routine.YearlyDate.Day == dayOfMonth
```

### Streak Tracking Logic

**Completion Action:**

1. Check if already completed/skipped today (prevent duplicates)
2. Create `RoutineCompletion` with status = "completed"
3. Increment `CurrentStreak` by 1
4. Update `LongestStreak` if `CurrentStreak` > `LongestStreak`
5. Save routine with updated streaks

**Skip Action:**

1. Check if already completed/skipped today
2. Create `RoutineCompletion` with status = "skipped"
3. Do NOT modify streaks (skipping doesn't break streak)

**Missed Days:**

- Handled by checking last completion date
- If more than 1 day gap (for Daily routines), reset `CurrentStreak` to 0
- Implemented in service layer validation

### Deadline Display Rules

**`isOverdue(deadline: string): boolean`**

- Normalizes dates to start of day
- Returns `true` ONLY if deadline < today
- Today is NOT overdue

**`formatDeadline(deadline: string): {text, isRed, showOverdue}`**

```
diffDays === 0:  {text: "heute", isRed: true, showOverdue: false}
diffDays === -1: {text: "gestern", isRed: true, showOverdue: true}
diffDays < -1:   {text: "5. Jan", isRed: true, showOverdue: true}
diffDays > 0:    {text: "10. Jan", isRed: false, showOverdue: false}
```

### State Persistence

**Zustand with Persist Middleware:**

- Task store: localStorage key = `'task-storage'`
- Auth store: localStorage key = `'auth-storage'`
- Routine store: localStorage key = `'routine-storage'`
- Automatic save on state changes
- Automatic load on app mount
- Syncs between tabs/windows

### API Integration Pattern

**Example: Creating a Routine**

```javascript
// 1. API function (lib/api/routines.ts)
export async function createRoutine(data: CreateRoutineRequest) {
  const response = await fetch('/api/routines', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return response.json()
}

// 2. Store action (lib/store/routine-store.ts)
createRoutine: async (data) => {
  const result = await apiCreateRoutine(data)
  set(state => ({
    routines: [...state.routines, result.routine]
  }))
}

// 3. Component usage
const { createRoutine } = useRoutineStore()
await createRoutine({ title, frequency, timeType, ... })
```

---

## 🎯 Development Approach & Best Practices

### Code Organization

- **Full File Paths**: Always specify complete paths for modifications
- **Clean Architecture**: Separation of concerns (Handler → Service → Repository)
- **Interface-based**: Dependencies on interfaces, not implementations
- **Type Safety**: TypeScript on frontend, strict typing in Go

### Development Flow

- **Incremental Development**: Build features one by one
- **Step-by-step Progression**: Validate at each stage
- **Component Isolation**: Each component has single responsibility
- **Reusable Utilities**: Shared logic in utility functions

### State Management Principles

- **Single Source of Truth**: Zustand stores as central state
- **Persistence**: LocalStorage for offline-first experience
- **API Integration**: Stores orchestrate API calls
- **Optimistic Updates**: UI updates immediately, syncs with backend

### Styling Guidelines

- **Dark-First**: All components optimized for dark mode
- **Consistent Spacing**: Use Tailwind spacing scale
- **Border Consistency**: `border-border` for all borders
- **Hover States**: Always provide visual feedback
- **Transitions**: Smooth animations with `transition-colors`

---

## 🚀 Running the Project

### Backend

```bash
cd my-life-os-backend
docker compose up -d
# Backend runs on http://localhost:8080
```

### Frontend

```bash
cd my-life-os-frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### First-Time Setup

1. Navigate to http://localhost:3000
2. Redirects to `/setup` (if no users exist)
3. Create first user (GORM auto-creates tables on first run)
4. Redirects to `/login`
5. Login with credentials
6. Access `/dashboard`

---

## 📊 Database Tables

Created by GORM AutoMigrate from entity structs:

**`users`:**

- `id` (UUID, primary key)
- `username` (VARCHAR)
- `password_hash` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

**`refresh_tokens`:**

- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users.id)
- `token` (VARCHAR)
- `expires_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

**`tasks`:**

- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users.id)
- `title` (VARCHAR, required)
- `description` (TEXT, optional)
- `priority` (VARCHAR: Low/Medium/High)
- `domain` (VARCHAR: 8 categories)
- `deadline` (TIMESTAMP, optional)
- `status` (VARCHAR: Todo/Done)
- `created_at`, `updated_at` (TIMESTAMP)

**`routines`:**

- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users.id)
- `title` (VARCHAR, required)
- `frequency` (VARCHAR: Daily/Weekly/Monthly/Quarterly/Yearly)
- `weekday` (INT, nullable, for Weekly)
- `day_of_month` (INT, nullable, for Monthly)
- `quarterly_day` (INT, nullable, for Quarterly)
- `yearly_date` (JSONB, nullable, {month, day} for Yearly)
- `is_skippable` (BOOLEAN, default: false)
- `show_streak` (BOOLEAN, default: false)
- `time_type` (VARCHAR: AM/PM/AllDay/Specific)
- `specific_time` (VARCHAR, nullable, HH:mm format)
- `current_streak` (INT, default: 0)
- `longest_streak` (INT, default: 0)
- `created_at`, `updated_at` (TIMESTAMP)

**`routine_completions`:**

- `id` (UUID, primary key)
- `routine_id` (UUID, foreign key → routines.id)
- `user_id` (UUID, foreign key → users.id)
- `completed_at` (DATE, date only)
- `status` (VARCHAR: "completed" or "skipped")
- `created_at` (TIMESTAMP)

---

## 📝 Current Status

### ✅ Completed:

- Sprint 1: Project Setup & Infrastructure
- Sprint 2: Authentication System (Dual-token JWT)
- Sprint 3: Task Management System

  - Backend: Complete CRUD + Advanced Filtering
  - Frontend: Full task page with 3-column layout
  - Dashboard Widget: Weekly Task Board
  - Smart deadline formatting
  - Filter system (Domain + Time + Status)
  - Persistent state management

- Sprint 4: Daily Routines System
  - Backend: Complete CRUD + Frequency-based filtering
  - Frontend: Full routines page with 3-column layout
  - Dashboard Widget: Today's Routines Widget
  - Streak tracking with completion/skip actions
  - Today's routines matching (frequency-aware)
  - Filter system (Frequency-based)
  - Persistent state management

### ⏳ Pending Implementation:

- Other dashboard widgets (per Stand document)
- Remaining sidebar modules (Schedule, Projects, University, etc.)
- Rich text editor integration (TipTap installed but unused)
- Settings page
- Additional features as needed

---

## 💡 Key Learnings

- Visual feedback crucial for development motivation
- CSS fundamentals important (width/height behavior)
- Understanding core concepts before moving forward
- Incremental development over "build everything at once"
- Clean separation of concerns makes code maintainable
- Interface-based architecture enables testability
- Type safety prevents runtime errors
- Persistent state improves user experience
- GORM AutoMigrate simplifies schema management
- Frequency-based matching requires careful date logic
- Streak tracking needs careful state management and deduplication

---

## 📄 License

Personal Project - Not for commercial use

---

**This documentation provides complete context for continuing development. The project follows modern best practices, clean architecture patterns, and provides a solid foundation for adding new features.**
