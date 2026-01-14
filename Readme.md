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
- 🎯 **Icon-Grid Layout** - Detail Views mit großen, zentrierten Icon-Badges

### Icon-Grid Design Pattern

Alle Detail Views folgen einem konsistenten visuellen Muster für optimale Übersichtlichkeit:

**View Mode:**

```
┌──────────┬──────────┬──────────┬──────────┐
│    ○     │    ○     │    ○     │    ○     │  <- Icons (w-6 h-6) in colored circles (w-12 h-12)
│  Label   │  Label   │  Label   │  Label   │  <- Werte zentriert darunter
└──────────┴──────────┴──────────┴──────────┘
```

**Eigenschaften:**

- Icons in runden, farbigen Backgrounds (w-12 h-12)
- Icon-Größe: w-6 h-6
- Farben thematisch passend (z.B. Priority → rot/gelb/grün, Domain → primary)
- Werte in Medium Font Weight unter Icons
- Text zentriert
- Keine traditionellen Labels ("Priority:", "Domain:", etc.)

**Edit Mode:**

- Klassisches Formular-Layout (unverändert)
- Labels über Inputs
- Conditional Fields basierend auf Kontext
- Standard Dropdown/Input Felder

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
│   │   │   ├── routine_completion.go
│   │   │   └── event.go
│   │   └── interfaces/                 # Interface definitions
│   │       ├── repositories.go         # Repository interfaces
│   │       └── services.go             # Service interfaces
│   ├── repository/postgres/            # Data access layer
│   │   ├── user_repository.go
│   │   ├── token_repository.go
│   │   ├── task_repository.go
│   │   ├── routine_repository.go
│   │   └── event_repository.go
│   ├── service/                        # Business logic
│   │   ├── auth_service.go
│   │   ├── task_service.go
│   │   ├── routine_service.go
│   │   └── event_service.go
│   ├── handler/http/                   # HTTP handlers
│   │   ├── auth_handler.go
│   │   ├── task_handler.go
│   │   ├── routine_handler.go
│   │   └── event_handler.go
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
│   ├── routines/
│   │   └── page.tsx                    # Daily Routines Seite
│   └── schedule/
│       └── page.tsx                    # Schedule/Calendar Seite
│
├── components/
│   ├── auth-guard.tsx                  # Protected route wrapper
│   ├── sidebar.tsx                     # Sliding Overlay Navigation
│   ├── burger-menu.tsx                 # Mobile Menu Toggle
│   │
│   ├── dashboard/
│   │   ├── weekly-task-board.tsx       # Task Widget für Dashboard
│   │   ├── todays-routines-widget.tsx  # Daily Routines Widget
│   │   ├── week-ahead-widget.tsx       # Week Ahead Calendar Widget (NEW)
│   │   ├── event-detail-modal.tsx      # Event Detail Modal (NEW)
│   │   └── task-detail-modal.tsx       # Task Detail Modal
│   │
│   ├── tasks/
│   │   ├── quick-add-dialog.tsx        # Schnelles Task Erstellen
│   │   ├── task-detail-view.tsx        # Detailansicht (Rechts) - Icon-Grid Layout
│   │   ├── task-detail-modal.tsx       # Modal für Dashboard Widget - Icon-Grid Layout
│   │   ├── task-list.tsx               # Task Liste
│   │   ├── task-item.tsx               # Einzelner Task in Liste
│   │   └── task-filter-sidebar.tsx     # Domain/Time/Status Filter
│   │
│   ├── routines/
│   │   ├── quick-add-dialog.tsx        # Schnelles Routine Erstellen
│   │   ├── routine-detail-view.tsx     # Detailansicht (Rechts) - Icon-Grid Layout (4 columns)
│   │   ├── routines-list.tsx           # Routine Liste
│   │   ├── routine-item.tsx            # Einzelne Routine in Liste
│   │   └── routine-filter-sidebar.tsx  # Frequency Filter
│   │
│   └── schedule/
│       ├── calendar-view.tsx           # Calendar View Switcher
│       ├── month-view.tsx              # Month Calendar View (click-to-create)
│       ├── week-view.tsx               # Week Calendar View (click-to-create)
│       ├── day-view.tsx                # Day Calendar View (click-to-create)
│       ├── agenda-view.tsx             # Agenda List View
│       ├── quick-add-event-dialog.tsx  # Quick Event Creation
│       └── event-detail-view.tsx       # Event Detail View - Icon-Grid Layout
│
├── lib/
│   ├── utils.ts                        # Utility functions
│   ├── api/
│   │   ├── auth.ts                     # Auth API functions
│   │   ├── tasks.ts                    # Task API functions
│   │   ├── routines.ts                 # Routine API functions
│   │   └── events.ts                   # Event API functions
│   └── store/
│       ├── auth-store.ts               # Zustand auth state
│       ├── task-store.ts               # Zustand Task State Management
│       ├── routine-store.ts            # Zustand Routine State Management
│       └── event-store.ts              # Zustand Event State Management (with date conversion helpers)
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
- Event

```go
type Event struct {
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
    &entities.RoutineCompletion{},
    &entities.Event{}
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

**Task Detail View** (`task-detail-view.tsx`):

**View Mode - Icon-Grid Layout:**

```
Title
┌──────────┬──────────┬──────────┐
│    ↑     │    🏷️    │    📅    │  <- Icons (w-6 h-6) in colored circles (w-12 h-12)
│   High   │   Work   │  15. Jan │  <- Values below (text-sm font-medium)
└──────────┴──────────┴──────────┘
Description
[Edit Task] [Delete Task]
```

**Icon-Grid Details:**

- **Priority Icon**: Colored arrow (↑ ↓ −) in rounded background
  - High: red (bg-red-500/10, text-red-500)
  - Medium: yellow (bg-yellow-500/10, text-yellow-500)
  - Low: green (bg-green-500/10, text-green-500)
- **Domain Icon**: Tag icon in primary-colored background
- **Deadline Icon**: Calendar icon in muted background
- All icons: w-12 h-12 rounded-full containers
- Icon sizes: w-6 h-6
- Values: text-sm font-medium, centered

**Edit Mode:**

- Traditional form layout
- Title input
- Priority & Domain dropdowns (side by side)
- Deadline date picker
- Description textarea
- Save/Cancel buttons

**Removed:**

- "Priority", "Domain", "Deadline" text labels in view mode
- Created/Updated timestamp fields

**Task Detail Modal** (`task-detail-modal.tsx`):

- Centered modal with dark backdrop (bg-black/60 backdrop-blur-sm)
- Same 3-column icon-grid layout as detail view
- Max width: 2xl
- Max height: 80vh with scrolling
- Edit/Delete capabilities within modal
- Close: ESC key or backdrop click

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

**View Mode - Icon-Grid Layout (4 Columns):**

```
Title
┌──────────┬──────────┬──────────┬──────────┐
│    🔁    │    🕐    │    🔥    │    🔥    │  <- Icons in colored circles (w-12 h-12)
│  Daily   │ Morning  │    5     │   12     │  <- Values below
│          │          │  Current │ Longest  │
└──────────┴──────────┴──────────┴──────────┘

[Conditional Frequency Fields]
[Time Field if Specific]
[Options: Skippable, Show Streak]

[Edit Routine] [Delete Routine]
```

**Icon-Grid Details:**

- **Frequency Icon**: Repeat icon in frequency-colored background
  - Daily: blue (bg-blue-500/10, text-blue-500)
  - Weekly: green (bg-green-500/10, text-green-500)
  - Monthly: purple (bg-purple-500/10, text-purple-500)
  - Quarterly: orange (bg-orange-500/10, text-orange-500)
  - Yearly: pink (bg-pink-500/10, text-pink-500)
- **Time Type Icon**: Clock icon in blue background
- **Current Streak Icon**: Flame icon in orange background (bg-orange-500/10, text-orange-500)
- **Longest Streak Icon**: Flame icon in purple background (bg-purple-500/10, text-purple-500)
- All icons: w-12 h-12 rounded-full containers
- Icon sizes: w-6 h-6
- Values: text-sm font-medium, centered

**Conditional Fields (View Mode):**

- **Weekly**: Shows weekday name
- **Monthly**: Shows day of month
- **Quarterly**: Shows quarterly day
- **Yearly**: Shows month + day
- **Specific Time**: Shows HH:mm time

**Options Display:**

- Custom checkboxes (button-style, not HTML input)
- Skippable with SkipForward icon
- Show Streak with Flame icon

**Edit Mode:**

- Traditional form layout
- Frequency dropdown
- Time Type dropdown
- Conditional frequency fields appear based on selection
- Specific time input if Time Type = "Specific"
- Checkbox buttons for options

**Removed:**

- "Frequency", "Time Type", "Current Streak", "Longest Streak" text labels in view mode
- Created/Updated timestamp fields

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

---

### 4. Schedule/Calendar System (Sprint 5)

#### Backend Implementation

**Entity Definition** (`internal/domain/entities/event.go`):

```go
type Event struct {
    ID               uuid.UUID  `gorm:"type:uuid;primary_key" json:"id"`
    UserID           uuid.UUID  `gorm:"type:uuid;not null" json:"userId"`
    Title            string     `gorm:"type:varchar(255);not null" json:"title"`
    StartDate        time.Time  `gorm:"not null" json:"startDate"`
    EndDate          *time.Time `gorm:"type:timestamp" json:"endDate"`
    AllDay           bool       `gorm:"not null;default:false" json:"allDay"`
    Domain           string     `gorm:"type:varchar(100);not null" json:"domain"`

    // Recurrence
    IsRecurring      bool       `gorm:"not null;default:false" json:"isRecurring"`
    RecurrenceType   *string    `gorm:"type:varchar(50)" json:"recurrenceType"` // daily, weekly, monthly, yearly
    RecurrenceEnd    *time.Time `gorm:"type:timestamp" json:"recurrenceEnd"`

    // Options
    HideFromAgenda   bool       `gorm:"not null;default:false" json:"hideFromAgenda"`

    CreatedAt        time.Time  `gorm:"not null" json:"createdAt"`
    UpdatedAt        time.Time  `gorm:"not null" json:"updatedAt"`
}
```

- GORM creates `events` table from this struct
- Single-table recurrence pattern
- Occurrences generated on-the-fly in service layer

**Service Layer Logic:**

- Complete CRUD operations with recurrence support
- **Edit Scopes**:
  - `this`: Only edit this occurrence (creates exception)
  - `following`: Edit this and all future occurrences
  - `all`: Edit all occurrences
- **Delete Scopes**:
  - `this`: Only delete this occurrence (creates exception)
  - `following`: Delete this and all future occurrences
  - `all`: Delete all occurrences
- Occurrence generation for recurring events within date range
- Conflict detection
- 12 event domains

**API Endpoints:**

```
GET    /api/events               - Get events in date range
       ?start=2025-01-01T00:00   - Start date (required)
       &end=2025-01-31T23:59     - End date (required)
POST   /api/events               - Create new event
GET    /api/events/:id           - Get single event
PUT    /api/events/:id           - Update event (with editScope)
       body: { editScope, occurrenceDate?, ...data }
DELETE /api/events/:id           - Delete event (with deleteScope)
       body: { deleteScope, occurrenceDate? }
```

#### Frontend Implementation

**Page Layout** (`/schedule`):

```
┌─────────────────────────────────────────────────────────────┬──────────────┐
│                     Calendar Header                         │              │
│  [Month][Week][Day][Agenda]  [<] [Today] [>] January 2025  │              │
├─────────────────────────────────────────────────────────────┤              │
│                                                              │              │
│                      Calendar View                           │ Detail View  │
│              (Month/Week/Day/Agenda)                         │   (Always)   │
│                       1fr                                    │    450px     │
│                                                              │              │
└─────────────────────────────────────────────────────────────┴──────────────┘
```

**Navigation:**

- View selector buttons: Month, Week, Day, Agenda
- Previous/Next buttons
- Today button (jumps to current date)
- Current period display (centered, e.g. "January 2025")

**Calendar Views:**

**Month View** (`month-view.tsx`):

- Grid layout: 7 columns (Mon-Sun)
- Week starts Monday
- Day cells show:
  - Day number
  - Event badges (colored by domain)
  - Max 3 events visible, "+X more" indicator
- Click day cell → Opens Quick Add with prefilled date
- Click event → Selects event for detail view
- Today highlighted

**Week View** (`week-view.tsx`):

- Grid layout: 8 columns (Time + 7 days)
- Hour rows: 0-23
- All-day row at top
- Click all-day cell → Opens Quick Add with allDay=true
- Click time slot → Opens Quick Add with specific time
- Events positioned in time slots
- Domain-colored left border
- Today column highlighted

**Day View** (`day-view.tsx`):

- Single day view
- Hour rows: 0-23
- All-day section (only shows if events exist)
- Click time slot → Opens Quick Add with specific time
- Events positioned in time slots
- Wide layout for detailed view

**Agenda View** (`agenda-view.tsx`):

- List view of next 30 days
- Grouped by date
- Shows: Title, Time, Domain badge
- Click event → Selects for detail view
- Scrollable list

**Event Detail View** (`event-detail-view.tsx`):

**View Mode - Icon-Grid Layout:**

```
Title
┌──────────┬──────────┬──────────┐
│    🏷️    │    📅    │    🕐    │  <- Icons in colored circles (w-12 h-12)
│   Work   │  15. Jan │  09:00   │  <- Values below
│          │          │  - 10:00 │
└──────────┴──────────┴──────────┘

Recurrence: 🔁 Weekly until 31. Dec
Hidden from Agenda (if applicable)

[Edit Event] [Delete Event]
```

**Icon-Grid Details:**

- **Domain Icon**: Tag icon in primary-colored background (bg-primary/10, text-primary)
- **Date Icon**: Calendar icon in muted background (bg-muted, text-muted-foreground)
- **Time Icon**: Clock icon in blue background (bg-blue-500/10, text-blue-500)
- All icons: w-12 h-12 rounded-full containers
- Icon sizes: w-6 h-6
- Values: text-sm font-medium, centered
- Time shows "All Day" or "HH:mm - HH:mm" format

**Recurrence Display:**

- Shows if event is recurring
- Format: "🔁 [type] until [end date]"
- Displayed below icon grid

**Edit Mode:**

- Edit scope selector (for recurring events):
  - "Only this occurrence"
  - "This and following occurrences"
  - "All occurrences"
- Form fields:
  - Title input
  - Domain dropdown
  - Date + Time inputs (grid layout)
  - All Day checkbox (button style)
  - Hide from Agenda checkbox (button style)
- Save/Cancel buttons

**Delete Confirmation:**

- Delete scope selector (for recurring events)
- Confirmation dialog
- Delete/Cancel buttons

**Removed:**

- "Domain", "Date", "Time" text labels in view mode
- Created/Updated timestamp fields

**Quick Add Event Dialog** (`quick-add-event-dialog.tsx`):

- Modal for fast event creation
- Supports prefilling from calendar clicks:
  - `prefilledDate`: Date from clicked day
  - `prefilledTime`: Time from clicked slot
- Fields:
  - Title (required)
  - Domain dropdown
  - Date input
  - Start Time + End Time (hidden if All Day)
  - All Day checkbox (button style)
  - Is Recurring checkbox (button style)
  - Hide from Agenda checkbox (button style)
- Conditional recurring fields:
  - Recurrence Type dropdown
  - Recurrence End date
- Create button
- Grid layout: 1 column (all day) or 3 columns (date + times)

**State Management** (`event-store.ts`):

Interface:

```typescript
- events: Event[]
- selectedEvent: Event | null
- currentView: CalendarView ("month" | "week" | "day" | "agenda")
- currentDate: Date
- isLoading: boolean
```

Actions:

- `fetchEvents(startDate, endDate)` - Fetch events in range
- `createEvent(data)` - Create + auto-refetch
- `updateEvent(id, data)` - Update + auto-refetch
- `deleteEvent(id, data)` - Delete + auto-refetch
- `selectEvent(event)`
- `setCurrentView(view)`
- `setCurrentDate(date)`
- `goToToday()`

**Important - Date Handling:**

`currentDate` is stored as Date in state but persisted as string in localStorage. Helper function converts:

```typescript
const getDateRangeForView = (view: CalendarView, date: Date | string) => {
  const d = date instanceof Date ? date : new Date(date);
  // ... calculate range
};
```

Applied in:

- `fetchEvents` useEffect
- Navigation handlers (prev/next)
- Period text display

**Auto-Refetch:**

After create/update/delete, store automatically refetches events for current view:

```typescript
const { currentDate, currentView } = get();
const { start, end } = getDateRangeForView(currentView, currentDate);
await get().fetchEvents(start.toISOString(), end.toISOString());
```

Ensures:

- Recurring occurrences appear immediately
- UI updates without manual refresh
- Date range matches current view

Persistence:

- localStorage key: `'event-storage'`
- Auto-saves on every change
- currentDate stored as ISO string

---

### 5. Dashboard (`/dashboard`)

**Layout:**

- Dynamic greeting: "Guten Morgen/Tag/Abend/Noch wach, Alex"
- Current date in German: "Mittwoch, der 7. Januar 2026"
- Gradient header with decorative line
- Widget grid layout
- Proper padding: `px-36 pr-16`
- Space between widgets: `space-y-6`

**Widget Organization:**

```
┌────────────────────────────────────────────────────┐
│           Week Ahead Widget (Full Width)           │  <- NEW
├────────────────────────┬───────────────────────────┤
│   Weekly Task Board    │  Today's Routines Widget  │
│      (2 columns)       │       (1 column)          │
└────────────────────────┴───────────────────────────┘
```

#### Week Ahead Widget (`week-ahead-widget.tsx`) [NEW]

**Header:**

- Purple calendar icon (Calendar from lucide-react)
- "Week Ahead" title
- "+" button for Quick Add Event
- Expand/Collapse toggle (ChevronDown/ChevronUp)

**Default State:** Collapsed

**When Expanded:**

**Layout - Horizontal 7-Day Grid:**

```
┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ Wed 14  │ Thu 15  │ Fri 16  │ Sat 17  │ Sun 18  │ Mon 19  │ Tue 20  │  <- Day Headers
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ ┌─────┐ │ ┌─────┐ │         │ ┌─────┐ │         │ ┌─────┐ │         │
│ │Event│ │ │Event│ │   No    │ │Event│ │   No    │ │Event│ │   No    │
│ └─────┘ │ └─────┘ │ Events  │ └─────┘ │ Events  │ └─────┘ │ Events  │
│ ┌─────┐ │         │   🎉    │         │   🎉    │         │   🎉    │
│ │Event│ │         │         │         │         │         │         │
│ └─────┘ │         │         │         │         │         │         │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

**Features:**

- **Day Columns**: 7 equal-width columns (`grid-cols-7`)
- **Day Headers**:
  - Weekday abbreviation (EEE format via date-fns)
  - Day number
  - Centered text
  - Border bottom
- **Event Cards**:
  - All-day events: "📅 All Day"
  - Timed events: "🕐 HH:mm"
  - Title (truncated)
  - Domain-colored left border (4px)
  - Hover effect
  - Click → Opens Event Detail Modal
- **Empty State**: "No Events 🎉" centered in column
- **Scrolling**: Each column individually scrollable (max-h-240px)
- **Logic**: Shows next 7 days from today (not fixed Mon-Sun)

**Date Range Calculation:**

```typescript
const today = new Date();
const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
```

**Event Filtering:**

```typescript
const getEventsForDay = (day: Date) => {
  return events
    .filter((event) => isSameDay(new Date(event.startDate), day))
    .sort((a, b) => {
      // All-day events first
      if (a.allDay && !b.allDay) return -1;
      if (!a.allDay && b.allDay) return 1;
      // Then sort by time
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
};
```

**Domain Colors:**

```typescript
const getDomainColor = (domain: string) => {
  const colors: Record<string, string> = {
    Work: "border-blue-500",
    University: "border-purple-500",
    Personal: "border-green-500",
    "Coding Time": "border-cyan-500",
    Study: "border-indigo-500",
    Health: "border-pink-500",
    Social: "border-yellow-500",
    Holidays: "border-red-500",
    Travel: "border-orange-500",
    Maintenance: "border-gray-500",
    Entertainment: "border-fuchsia-500",
    Family: "border-emerald-500",
  };
  return colors[domain] || "border-primary";
};
```

**Data Fetching:**

```typescript
useEffect(() => {
  const start = startOfDay(today);
  const end = endOfDay(addDays(today, 6));
  fetchEvents(start.toISOString(), end.toISOString());
}, [fetchEvents]);
```

**Design:**

- Purple theme (matching calendar icon)
- Clean, minimal styling
- NO event count badge (removed)
- NO statistics text (removed)
- Grid gaps: 12px (`gap-3`)
- Event card padding: 8px (`p-2`)
- Event card spacing: 6px (`space-y-1.5`)

**Interactions:**

- Click event → Opens `EventDetailModal`
- Click "+" → Opens `QuickAddEventDialog`
- Click expand/collapse → Toggles widget

#### Event Detail Modal (`event-detail-modal.tsx`) [NEW]

**Purpose:** View event details from dashboard widgets without navigating to schedule page

**Layout:**

```
┌────────────────────────────────┐
│      Event Details         [X] │  <- Header (sticky)
├────────────────────────────────┤
│                                │
│           Title                │
│                                │
│  ┌──────┬──────┬──────┐        │  <- 3-column icon-grid
│  │ 🏷️  │ 📅  │ 🕐  │        │
│  │Domain│Date │Time │        │
│  └──────┴──────┴──────┘        │
│                                │
│  Recurrence info               │
│  (if recurring)                │
│                                │
│  [View Full Details]           │  <- Navigate to schedule
│                                │
└────────────────────────────────┘
```

**Features:**

- **Modal Positioning**: Centered with dark backdrop (bg-black/50)
- **Max Width**: md (28rem/448px)
- **Max Height**: 90vh with overflow scroll
- **Icon-Grid Layout**: Same 3-column design as Event Detail View
  - Domain (tag icon, primary color)
  - Date (calendar icon, muted color)
  - Time (clock icon, blue color)
- **Recurrence Display**: Shows recurrence info if applicable
- **Hide from Agenda**: Badge display if enabled
- **View Full Details Button**:
  - Calls `selectEvent(event)` to set in store
  - Closes modal
  - User can then navigate to schedule page to see full detail view
- **Close Methods**:
  - X button in header
  - Click backdrop
  - ESC key (via useEffect)

**State Management:**

```typescript
const [event, setEvent] = useState<any>(null);

useEffect(() => {
  if (eventId && isOpen) {
    const foundEvent = events.find((e) => e.id === eventId);
    setEvent(foundEvent || null);
    if (foundEvent) {
      selectEvent(foundEvent);
    }
  }
}, [eventId, isOpen, events, selectEvent]);
```

**Design:**

- Consistent with main Event Detail View
- Same icon sizes (w-12 h-12 containers, w-6 h-6 icons)
- Same color scheme
- Sticky header for long content
- Border: 2px solid border color
- Rounded corners: rounded-lg

**Props:**

```typescript
interface EventDetailModalProps {
  eventId: string | null;
  isOpen: boolean;
  onClose: () => void;
}
```

**Usage in Week Ahead Widget:**

```typescript
const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const handleEventClick = (eventId: string) => {
  setSelectedEventId(eventId);
  setIsModalOpen(true);
};

// In JSX:
<EventDetailModal
  eventId={selectedEventId}
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setSelectedEventId(null);
  }}
/>;
```

#### Weekly Task Board Widget (`weekly-task-board.tsx`)

**Header:**

- Blue clipboard icon (ClipboardCheck)
- "Task Manager" title
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
  - Same functionality as task detail view
  - **3-column icon-grid layout for meta info**
  - Edit/Delete capabilities
  - Close button + backdrop click to close

**Design:**

- NO gradient styling (unlike potential future widgets)
- Single color icon (blue)
- Clean, simple aesthetic
- Spans 2 columns in dashboard grid

#### Today's Routines Widget (`todays-routines-widget.tsx`)

**Header:**

- Green repeat icon (Repeat)
- "Today's Routines" title
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
- Spans 1 column in dashboard grid

**Functionality:**

- Complete button: Calls `completeRoutine(id)` API
- Skip button: Calls `skipRoutine(id)` API
- Both actions update local state immediately
- Prevents duplicate actions (one per routine per day)
- Fetches today's routines on mount using `fetchTodaysRoutines()`

---

## 🎯 Detail View Design Pattern (Complete Specification)

All detail views (Tasks, Events, Routines) follow a consistent icon-grid layout pattern for optimal visual clarity and user experience.

### View Mode Layout

**Tasks (3 Columns):**

```
┌──────────┬──────────┬──────────┐
│    ↑     │    🏷️    │    📅    │  <- Priority, Domain, Deadline
│   High   │   Work   │  15. Jan │
└──────────┴──────────┴──────────┘
```

**Events (3 Columns):**

```
┌──────────┬──────────┬──────────┐
│    🏷️    │    📅    │    🕐    │  <- Domain, Date, Time
│   Work   │  15. Jan │  09:00   │
└──────────┴──────────┴──────────┘
```

**Routines (4 Columns):**

```
┌──────────┬──────────┬──────────┬──────────┐
│    🔁    │    🕐    │    🔥    │    🔥    │  <- Frequency, Time, Current, Longest
│  Daily   │ Morning  │    5     │   12     │
└──────────┴──────────┴──────────┴──────────┘
```

### Design Specifications

**Icon Containers:**

- Size: w-12 h-12
- Shape: rounded-full
- Background: Theme-colored with 10% opacity (e.g., bg-red-500/10)
- Centered using flexbox
- Margin: mx-auto mb-2

**Icons:**

- Size: w-6 h-6
- Color: Matches container theme (e.g., text-red-500)
- Lucide React icons

**Values:**

- Font: text-sm font-medium
- Centered: text-center
- Color: Matches theme or neutral

**Color Themes:**

Tasks:

- Priority High: red (bg-red-500/10, text-red-500)
- Priority Medium: yellow (bg-yellow-500/10, text-yellow-500)
- Priority Low: green (bg-green-500/10, text-green-500)
- Domain: primary (bg-primary/10, text-primary)
- Deadline: muted (bg-muted, text-muted-foreground)

Events:

- Domain: primary (bg-primary/10, text-primary)
- Date: muted (bg-muted, text-muted-foreground)
- Time: blue (bg-blue-500/10, text-blue-500)

Routines:

- Frequency:
  - Daily: blue (bg-blue-500/10, text-blue-500)
  - Weekly: green (bg-green-500/10, text-green-500)
  - Monthly: purple (bg-purple-500/10, text-purple-500)
  - Quarterly: orange (bg-orange-500/10, text-orange-500)
  - Yearly: pink (bg-pink-500/10, text-pink-500)
- Time Type: blue (bg-blue-500/10, text-blue-500)
- Current Streak: orange (bg-orange-500/10, text-orange-500)
- Longest Streak: purple (bg-purple-500/10, text-purple-500)

### Implementation Example

```typescript
{
  /* Icon-Grid Layout (View Mode) */
}
{
  !isEditing && (
    <div className="grid grid-cols-3 gap-4">
      {/* Priority */}
      <div className="text-center">
        <div
          className={`flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full ${priorityColor.bg}`}
        >
          <span className={`text-2xl ${priorityColor.text}`}>
            {priorityColor.icon}
          </span>
        </div>
        <div className={`text-sm font-medium ${priorityColor.text}`}>
          {task.priority}
        </div>
      </div>
      {/* ... more columns */}
    </div>
  );
}
```

### Edit Mode

Edit mode maintains traditional form layout:

- Labels above inputs
- Standard form controls (inputs, dropdowns, textareas)
- Conditional fields based on context
- Save/Cancel buttons
- No icon-grid layout in edit mode

### What Was Removed

**From all detail views:**

- Text labels in view mode ("Priority:", "Domain:", "Deadline:", etc.)
- Created timestamp
- Updated timestamp
- Timestamps section with "Created:" and "Updated:" labels

**Design Philosophy:**

- Icons and values speak for themselves
- Cleaner, more modern appearance
- Reduced visual clutter
- Faster information parsing
- Consistent across all modules

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
- Event

### State Persistence & Date Handling

**Zustand with Persist Middleware:**

- Task store: localStorage key = `'task-storage'`
- Auth store: localStorage key = `'auth-storage'`
- Routine store: localStorage key = `'routine-storage'`
- Event store: localStorage key = `'event-storage'`
- Automatic save on state changes
- Automatic load on app mount
- Syncs between tabs/windows

**Critical: Date Persistence Issue**

localStorage persists Date objects as strings. This causes issues when:

- Accessing date methods (e.g., `currentDate.getMonth()`)
- Comparing dates
- Calculating date ranges

**Solution - Type Conversion Pattern:**

```typescript
// Always convert to Date before use:
const date = currentDate instanceof Date ? currentDate : new Date(currentDate);
```

**Applied in:**

1. **Schedule Page** (`app/schedule/page.tsx`):

   - `getCurrentPeriodText()` - Display current month/week/day
   - `getDateRangeForView()` - Calculate date ranges
   - `getWeekStart()` - Find Monday of week
   - `handlePrevious()` / `handleNext()` - Navigation

2. **Event Store** (`lib/store/event-store.ts`):
   - `getDateRangeForView()` helper for auto-refetch

**Example Implementation:**

```typescript
const getCurrentPeriodText = () => {
  // Convert string to Date if needed
  const date = currentDate instanceof Date ? currentDate : new Date(currentDate);

  const monthNames = ["January", "February", ...];

  switch (currentView) {
    case "month":
      return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    case "week":
      const weekStart = getWeekStart(date);
      // ...
  }
};
```

### Auto-Refetch Pattern

After create/update/delete operations, stores automatically refetch data to ensure UI consistency:

**Event Store Example:**

```typescript
createEvent: async (data) => {
  await apiCreateEvent(data);

  // Auto-refetch current view
  const { currentDate, currentView } = get();
  const { start, end } = getDateRangeForView(currentView, currentDate);
  await get().fetchEvents(start.toISOString(), end.toISOString());
},
```

**Benefits:**

- Recurring event occurrences appear immediately
- No manual refresh needed
- UI always in sync with backend
- Date range matches current calendar view

**Applied to:**

- Event create/update/delete
- Task create/update/delete
- Routine create/update/delete

### Widget State Management

Dashboard widgets maintain independent expansion states:

```typescript
const [weekAheadExpanded, setWeekAheadExpanded] = useState(false);
const [taskBoardExpanded, setTaskBoardExpanded] = useState(false);
const [routinesExpanded, setRoutinesExpanded] = useState(false);
```

**Default:** All widgets collapsed
**Benefit:** Cleaner dashboard, user controls what they see

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

**`events`:**

- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users.id)
- `title` (VARCHAR, required)
- `start_date` (TIMESTAMP, required)
- `end_date` (TIMESTAMP, nullable)
- `all_day` (BOOLEAN, default: false)
- `domain` (VARCHAR: 12 categories)
- `is_recurring` (BOOLEAN, default: false)
- `recurrence_type` (VARCHAR, nullable: daily/weekly/monthly/yearly)
- `recurrence_end` (TIMESTAMP, nullable)
- `hide_from_agenda` (BOOLEAN, default: false)
- `created_at`, `updated_at` (TIMESTAMP)

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
  - **Detail Views: 3-column icon-grid layout**
  - **Removed: Created/Updated timestamps**

- Sprint 4: Daily Routines System

  - Backend: Complete CRUD + Frequency-based filtering
  - Frontend: Full routines page with 3-column layout
  - Dashboard Widget: Today's Routines Widget
  - Streak tracking with completion/skip actions
  - Today's routines matching (frequency-aware)
  - Filter system (Frequency-based)
  - **Detail View: 4-column icon-grid layout**
  - **Removed: Created/Updated timestamps**

- Sprint 5: Schedule/Calendar System
  - Backend: Complete CRUD + Recurrence + Scopes
  - Frontend: 4 calendar views (Month/Week/Day/Agenda)
  - Click-to-create events in all views
  - Recurring events with edit/delete scopes
  - Conflict detection
  - **Detail View: 3-column icon-grid layout**
  - **Removed: Created/Updated timestamps**
  - **Dashboard Widget: Week Ahead (Horizontal 7-day grid)**
  - **Event Detail Modal: Quick view from dashboard**
  - **Date conversion fixes: localStorage persistence handling**
  - **Auto-refetch: Immediate UI updates after mutations**

### ⏳ Pending Implementation:

- Other dashboard widgets (per planning)
- Remaining sidebar modules (Projects, University, etc.)
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
- Recurring events require thoughtful edit/delete scope handling
- **Consistent icon-grid layout dramatically improves UX across modules**
- **Date persistence in localStorage requires systematic type conversion**
- **Auto-refetch pattern ensures UI consistency after mutations**
- **Modals provide contextual detail views without navigation**
- **Horizontal layouts (Week Ahead) utilize available screen space better**

---

## 📄 License

Personal Project - Not for commercial use

---

**This documentation provides complete context for continuing development. The project follows modern best practices, clean architecture patterns, and provides a solid foundation for adding new features.**
