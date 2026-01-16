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
│   │   │   ├── routine_completion.go
│   │   │   ├── project.go
│   │   │   ├── project_task.go
│   │   │   ├── category.go
│   │   │   └── tech_stack_item.go
│   │   └── interfaces/                 # Interface definitions
│   │       ├── repositories.go         # Repository interfaces
│   │       └── services.go             # Service interfaces
│   ├── repository/postgres/            # Data access layer
│   │   ├── user_repository.go
│   │   ├── token_repository.go
│   │   ├── task_repository.go
│   │   ├── routine_repository.go
│   │   ├── project_repository.go
│   │   ├── category_repository.go
│   │   └── tech_stack_item_repository.go
│   ├── service/                        # Business logic
│   │   ├── auth_service.go
│   │   ├── task_service.go
│   │   ├── routine_service.go
│   │   ├── project_service.go
│   │   ├── category_service.go
│   │   └── tech_stack_item_service.go
│   ├── handler/http/                   # HTTP handlers
│   │   ├── auth_handler.go
│   │   ├── task_handler.go
│   │   ├── routine_handler.go
│   │   ├── project_handler.go
│   │   ├── category_handler.go
│   │   └── tech_stack_item_handler.go
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
│   ├── projects/
│   │   └── page.tsx                    # Project Manager Seite
│   └── settings/
│       └── page.tsx                    # Settings Seite
│
├── components/
│   ├── auth-guard.tsx                  # Protected route wrapper
│   ├── sidebar.tsx                     # Sliding Overlay Navigation
│   ├── burger-menu.tsx                 # Mobile Menu Toggle
│   │
│   ├── dashboard/
│   │   ├── weekly-task-board.tsx       # Task Widget für Dashboard
│   │   ├── todays-routines-widget.tsx  # Daily Routines Widget
│   │   ├── week-ahead-widget.tsx       # Week Preview Widget
│   │   └── featured-project-widget.tsx # Featured Project Widget
│   │
│   ├── tasks/
│   │   ├── quick-add-dialog.tsx        # Schnelles Task Erstellen
│   │   ├── task-detail-view.tsx        # Detailansicht (Rechts)
│   │   ├── task-detail-modal.tsx       # Modal für Dashboard Widget
│   │   ├── task-list.tsx               # Task Liste
│   │   ├── task-item.tsx               # Einzelner Task in Liste
│   │   └── task-filter-sidebar.tsx     # Domain/Time/Status Filter
│   │
│   ├── routines/
│   │   ├── quick-add-dialog.tsx        # Schnelles Routine Erstellen
│   │   ├── routine-detail-view.tsx     # Detailansicht (Rechts)
│   │   ├── routines-list.tsx           # Routine Liste
│   │   ├── routine-item.tsx            # Einzelne Routine in Liste
│   │   └── routine-filter-sidebar.tsx  # Frequency Filter
│   │
│   ├── projects/
│   │   ├── quick-add-dialog.tsx        # Schnelles Project Erstellen
│   │   ├── project-detail-view.tsx     # Detailansicht (Rechts)
│   │   ├── project-list.tsx            # Project Liste
│   │   ├── project-item.tsx            # Einzelnes Project in Liste
│   │   └── project-filter-sidebar.tsx  # Status/TechStack Filter
│   │
│   └── settings/
│       └── tech-stack-manager-dialog.tsx # Tech Stack Management
│
├── lib/
│   ├── utils.ts                        # Utility functions
│   ├── api/
│   │   ├── auth.ts                     # Auth API functions
│   │   ├── tasks.ts                    # Task API functions
│   │   ├── routines.ts                 # Routine API functions
│   │   ├── projects.ts                 # Project API functions
│   │   ├── categories.ts               # Category API functions
│   │   └── tech-stack-items.ts         # Tech Stack Item API functions
│   └── store/
│       ├── auth-store.ts               # Zustand auth state
│       ├── task-store.ts               # Zustand Task State Management
│       ├── routine-store.ts            # Zustand Routine State Management
│       ├── project-store.ts            # Zustand Project State Management
│       ├── category-store.ts           # Zustand Category State Management
│       └── tech-stack-store.ts         # Zustand Tech Stack State Management
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
- Project
- ProjectTask (join table)
- Category
- TechStackItem

```go
type Project struct {
    ID             uuid.UUID       `gorm:"type:uuid;primary_key" json:"id"`
    UserID         uuid.UUID       `gorm:"type:uuid;not null" json:"userId"`
    Title          string          `gorm:"type:varchar(255);not null" json:"title"`
    Description    string          `gorm:"type:text;not null" json:"description"`
    Status         string          `gorm:"type:varchar(50);not null" json:"status"`
    RepositoryUrl  *string         `gorm:"type:varchar(500)" json:"repositoryUrl"`
    TechStack      []TechStackItem `gorm:"many2many:project_tech_stack;" json:"techStack"`
    Tasks          []ProjectTask   `gorm:"foreignKey:ProjectID" json:"tasks"`
    CreatedAt      time.Time       `gorm:"not null" json:"createdAt"`
    UpdatedAt      time.Time       `gorm:"not null" json:"updatedAt"`
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
    &entities.Project{},
    &entities.ProjectTask{},
    &entities.Category{},
    &entities.TechStackItem{}
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

- **Time Filters** (with Icons + Colors):

  - ∞ All Tasks (Gray)
  - ⚠️ Overdue (Red)
  - 🕐 Today (Blue)
  - 📅 Tomorrow (Green)
  - 📆 Next Week (Purple)
  - 🗓️ Next Month (Orange)
  - ⏳ Long Term (Slate)

- **Domain Filters** (with Icons + Colors):

  - 💼 Work (Blue)
  - 🎓 University (Purple)
  - 💻 Coding Project (Green)
  - 💡 Personal Project (Yellow)
  - 🎯 Goals (Red)
  - 💰 Finances (Emerald)
  - 🏠 Household (Orange)
  - ❤️ Health (Pink)

- **Completion Filter** (with Icons):
  - ○ To do (Blue)
  - ✓ Done (Green)

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
  ┌──────────┬──────────┬──────────┐
  │ Priority │  Domain  │ Deadline │  (3 columns with icons)
  └──────────┴──────────┴──────────┘
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
- Fields: Title (required), Description, Priority dropdown, Domain dropdown, Deadline date picker
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
  | "overdue"
  | "today"
  | "tomorrow"
  | "next_week"
  | "next_month"
  | "long_term";

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

### 4. Project Management System (Sprint 5)

#### Backend Implementation

**Entity Definitions:**

**Project** (`internal/domain/entities/project.go`):

```go
type Project struct {
    ID            uuid.UUID       `gorm:"type:uuid;primary_key" json:"id"`
    UserID        uuid.UUID       `gorm:"type:uuid;not null" json:"userId"`
    Title         string          `gorm:"type:varchar(255);not null" json:"title"`
    Description   string          `gorm:"type:text;not null" json:"description"`
    Status        string          `gorm:"type:varchar(50);not null" json:"status"`
    RepositoryUrl *string         `gorm:"type:varchar(500)" json:"repositoryUrl"`

    // Relationships
    TechStack     []TechStackItem `gorm:"many2many:project_tech_stack;" json:"techStack"`
    Tasks         []ProjectTask   `gorm:"foreignKey:ProjectID" json:"tasks"`

    // Timestamps
    CreatedAt     time.Time       `gorm:"not null" json:"createdAt"`
    UpdatedAt     time.Time       `gorm:"not null" json:"updatedAt"`
}

// Method to calculate progress
func (p *Project) GetProgress() int {
    if len(p.Tasks) == 0 {
        return 0
    }
    completed := 0
    for _, pt := range p.Tasks {
        if pt.Task != nil && pt.Task.Status == "Done" {
            completed++
        }
    }
    return (completed * 100) / len(p.Tasks)
}
```

**ProjectTask** (Join Table - `internal/domain/entities/project_task.go`):

```go
type ProjectTask struct {
    ID        uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
    ProjectID uuid.UUID `gorm:"type:uuid;not null" json:"projectId"`
    TaskID    uuid.UUID `gorm:"type:uuid;not null" json:"taskId"`
    Task      *Task     `gorm:"foreignKey:TaskID" json:"task"`
    CreatedAt time.Time `gorm:"not null" json:"createdAt"`
}
```

**Category** (`internal/domain/entities/category.go`):

```go
type Category struct {
    ID        uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
    UserID    uuid.UUID `gorm:"type:uuid;not null" json:"userId"`
    Name      string    `gorm:"type:varchar(100);not null" json:"name"`
    CreatedAt time.Time `gorm:"not null" json:"createdAt"`
    UpdatedAt time.Time `gorm:"not null" json:"updatedAt"`
}
```

**TechStackItem** (`internal/domain/entities/tech_stack_item.go`):

```go
type TechStackItem struct {
    ID         uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
    CategoryID uuid.UUID `gorm:"type:uuid;not null" json:"categoryId"`
    UserID     uuid.UUID `gorm:"type:uuid;not null" json:"userId"`
    Name       string    `gorm:"type:varchar(100);not null" json:"name"`
    CreatedAt  time.Time `gorm:"not null" json:"createdAt"`
    UpdatedAt  time.Time `gorm:"not null" json:"updatedAt"`
}
```

- GORM creates `projects`, `project_tasks`, `project_tech_stack` (many2many), `categories`, and `tech_stack_items` tables
- Many-to-many relationships handled automatically by GORM

**Service Layer Logic:**

**Projects:**

- Complete CRUD operations
- Advanced filtering by Status and TechStack
- Progress calculation (completed tasks / total tasks)
- Task assignment/unassignment
- TechStack management (many-to-many)

**Categories:**

- CRUD operations for organizing tech stack items
- User-specific categories

**TechStackItems:**

- CRUD operations
- Category-based filtering
- Reusable across multiple projects

**API Endpoints:**

```
# Projects
GET    /api/projects                    - Get all projects (with filters)
       ?status=Active                   - Filter by status
       &techStackIds=uuid1,uuid2        - Filter by tech stack items
POST   /api/projects                    - Create new project
GET    /api/projects/:id                - Get single project
PUT    /api/projects/:id                - Update project
DELETE /api/projects/:id                - Delete project

# Project-Task Assignment
POST   /api/projects/:id/tasks          - Assign task to project
       Body: { taskId: "uuid" }
DELETE /api/projects/:id/tasks/:taskId  - Unassign task from project
GET    /api/projects/:id/tasks          - Get all tasks assigned to project

# Categories
GET    /api/categories                  - Get all categories
POST   /api/categories                  - Create category
       Body: { name: "string" }
GET    /api/categories/:id              - Get single category
PUT    /api/categories/:id              - Update category
DELETE /api/categories/:id              - Delete category

# Tech Stack Items
GET    /api/tech-stack                  - Get all tech stack items
       ?categoryId=uuid                 - Filter by category
POST   /api/tech-stack                  - Create tech stack item
       Body: { name: "string", categoryId: "uuid" }
GET    /api/tech-stack/:id              - Get single item
PUT    /api/tech-stack/:id              - Update item
DELETE /api/tech-stack/:id              - Delete item
```

#### Frontend Implementation

**Page Layout** (`/projects`):

```
┌─────────────┬────────────────────┬──────────────┐
│   Sidebar   │   Project List     │ Detail View  │
│  (Filters)  │  (with New Button) │   (Always)   │
│   280px     │       1fr          │    450px     │
└─────────────┴────────────────────┴──────────────┘
```

**Filter Sidebar** (`project-filter-sidebar.tsx`):

- **Status Filters** (with Icons + Colors):

  - 💡 Idea (Gray)
  - 📋 Planning (Blue)
  - ⚡ Active (Green)
  - 🐛 Debugging (Yellow)
  - 🧪 Testing (Orange)
  - ⏸️ OnHold (Purple)
  - ✅ Finished (Emerald)
  - ❌ Abandoned (Slate)

- **Tech Stack Filters** (Multi-Select):
  - Grouped by Categories
  - Toggle selection for each item
  - Shows selected count

**Project List** (`project-list.tsx`):

- Shows all projects (or filtered)
- Stats: "X projects" count
- New Project button opens Quick Add Dialog

**Project Item** (`project-item.tsx`):

- Status Badge (colored)
- Title
- Description preview (truncated)
- Progress Bar (X/Y tasks - Z%)
- Tech Stack Badges (max 4 + "X more")
- Click → Selects project for detail view

**Project Detail View** (`project-detail-view.tsx`):

- Fixed right panel (450px, always visible)
- Shows selected project details

**Layout:**

```
  Title ........................... [Status Badge]

  [Tech Stack Badges: React, Next.js, TypeScript, Go]

  Description

  Repository

  Progress
  ┌────────────────────────────┐
  │ ████████░░░░░░░░░░ 40%     │
  └────────────────────────────┘

  Assigned Tasks (5)
  - Task 1 [Priority] [Domain] [Deadline]
  - Task 2 [Priority] [Domain] [Deadline]

  ┌──────────┬──────────┐
  │ Created  │ Updated  │
  └──────────┴──────────┘
```

**Edit Mode:**

- Toggle with "Edit Project" button
- All fields editable:
  - Title (text input)
  - Description (textarea)
  - Status (dropdown)
  - Repository URL (text input)
  - Tech Stack (multi-select dialog)
  - Assigned Tasks (assignment dialog)
- Save/Cancel buttons
- Delete button with confirmation

**Quick Add Dialog** (`quick-add-dialog.tsx`):

- Modal for fast project creation
- **Required Fields:**
  - Title (text input)
  - Description (textarea)
- **Optional Fields:**
  - Status (dropdown, default: "Idea")
  - Repository URL (text input)
  - Tech Stack (multi-select, grouped by categories)
- Create button
- Closes on success

**State Management** (`project-store.ts`):

Interface:

```typescript
- projects: Project[]
- selectedProject: Project | null
- projectTasks: ProjectTask[]
- isLoading: boolean
- error: string | null
- statusFilter: ProjectStatus | null
- techStackFilter: string[]
```

Actions:

- `fetchProjects()`
- `fetchProjectsWithFilters(status?, techStackIds?)`
- `createProject(data)`
- `updateProject(id, data)`
- `deleteProject(id)`
- `selectProject(project)`
- `assignTask(projectId, taskId)`
- `unassignTask(projectId, taskId)`
- `fetchProjectTasks(projectId)`
- `setStatusFilter(status)`
- `setTechStackFilter(ids)`
- `clearFilters()`

Persistence:

- localStorage key: `'project-storage'`
- Auto-saves on every change

**TypeScript Types** (`types/index.ts`):

```typescript
type ProjectStatus =
  | "Idea"
  | "Planning"
  | "Active"
  | "Debugging"
  | "Testing"
  | "OnHold"
  | "Finished"
  | "Abandoned";

interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  repositoryUrl?: string;
  techStack?: TechStackItem[];
  tasks?: ProjectTask[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectTask {
  id: string;
  projectId: string;
  taskId: string;
  task?: Task;
  createdAt: string;
}

interface Category {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface TechStackItem {
  id: string;
  categoryId: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateProjectRequest {
  title: string;
  description: string;
  status: ProjectStatus;
  repositoryUrl?: string;
  techStackIds: string[];
}

interface AssignTaskRequest {
  taskId: string;
}
```

---

### 5. Dashboard (`/dashboard`)

**Layout:**

- Dynamic greeting: "Guten Morgen/Tag/Abend/Noch wach, Alex"
- Current date in German: "Mittwoch, der 7. Januar 2026"
- Gradient header with decorative line
- Widget grid layout
- Proper padding: `px-36 pr-16`

#### Week Ahead Widget (`week-ahead-widget.tsx`)

**Layout:** Full width above grid

**Header:**

- Calendar icon
- "Week Ahead" title
- Expand/Collapse toggle

**Features:**

- Shows upcoming week overview
- Independent expand/collapse state

#### Widget Grid (3 columns)

```
┌─────────────┬─────────────┬─────────────┐
│   Task      │  Routines   │  Featured   │
│   Board     │   Widget    │  Project    │
└─────────────┴─────────────┴─────────────┘
```

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

#### Featured Project Widget (`featured-project-widget.tsx`)

**Header:**

- Folder icon (FolderKanban)
- "Featured Project" title
- Progress badge (when collapsed): "X/Y (Z%)"
- "+" Quick Add button (ALWAYS visible)
- ⚙️ Settings button (Select Featured Project)
- Expand/Collapse toggle

**Default State:** Collapsed

**Quick Add Menu (Multi-Level):**

Click on "+" → Opens Action Selection Menu:

```
┌─────────────────────────────┐
│ Quick Add                   │
├─────────────────────────────┤
│ [📁] New Project            │  ← Blue
│     Create a new project    │
│                             │
│ [✚] New Task                │  ← Green
│     Create a completely...  │
│                             │
│ [🔗] Assign Existing Task   │  ← Purple
│     Add a task to this...   │
└─────────────────────────────┘
```

**Sub-Dialogs:**

1. **New Project Dialog:**

   - Title (required)
   - Description (required, textarea)
   - Status (dropdown: Idea/Planning/Active/etc.)
   - Repository URL (optional)
   - Tech Stack (multi-select, grouped by categories)
   - Creates project (not auto-featured)

2. **New Task Dialog:**

   - Title (required)
   - Description (optional, textarea)
   - Priority (dropdown)
   - Domain (dropdown)
   - Deadline (date picker)
   - Creates completely NEW task

3. **Assign Existing Task Dialog:**
   - Search bar for tasks
   - Shows available tasks (not already assigned)
   - Each task shows: Title, Priority, Domain, Deadline
   - Click task → Assigns to featured project
   - Auto-filters out already assigned tasks

**Project Selection (Settings Icon):**

Click on ⚙️ → Opens Project Selector Modal:

- Lists all projects
- Shows: Title, Status Badge, Task Count
- Selected project has ✓ checkmark
- Click project → Updates featured project
- Saved in localStorage (`featuredProjectId`)

**Fallback Logic:**

- If no project selected → Shows most recently updated project
- If selected project deleted → Fallback to most recent

**When Expanded:**

Layout:

```
Title ........................... [Status Badge]

[Tech Stack: React, Next.js, Go, PostgreSQL]

Description
(scrollable, max-height: 96px)

Repository
https://github.com/...

Progress
X / Y tasks completed        Z%
┌────────────────────────────┐
│ ████████░░░░░░░░░░         │
└────────────────────────────┘

Assigned Tasks (Y)
(scrollable, max-height: 192px)
- Task 1 [Priority] [Domain] [Deadline]
- Task 2 [Priority] [Domain] [Deadline]

[View Full Project] Button
```

**Features:**

- Click Task → Opens Full TaskDetailModal (Edit/Delete/Mark Done)
- Repository link opens in new tab
- Progress bar with animation
- Clean, simple design (no gradients)
- Scrollable sections (Description, Tasks)

**State:**

- localStorage key: `'featuredProjectId'`
- Independent expand/collapse (not synced with other widgets)

---

### 6. Settings Page (`/settings`)

**Layout:**

Single large box container (like Tasks/Projects pages):

```
┌─────────────────────────────────┐
│ ⚙️ Settings                     │
├─────────────────────────────────┤
│                                 │
│ Tech Stack Management           │
│ [Manage Categories & Items]     │
│                                 │
└─────────────────────────────────┘
```

**Tech Stack Management Dialog:**

Opens full-screen modal for managing:

1. **Categories:**

   - Create category
   - Edit category name
   - Delete category (with items warning)

2. **Tech Stack Items:**
   - Create item (select category)
   - Edit item name
   - Move item to different category
   - Delete item (with projects warning)

**Features:**

- Grouped display by category
- Drag-and-drop reordering (future)
- Validation (no empty names)
- Cascade warnings (deleting category with items)

---

### 7. Navigation System

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
  ├── Projects  ← NEW!
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

⚙️ Settings  ← NEW!
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
- Project
- ProjectTask (join table)
- Category
- TechStackItem

**Many-to-Many Relationships:**

```go
type Project struct {
    TechStack []TechStackItem `gorm:"many2many:project_tech_stack;" json:"techStack"`
}
```

GORM automatically creates `project_tech_stack` join table with:

- `project_id` (UUID)
- `tech_stack_item_id` (UUID)

### Authentication Pattern

**HttpOnly Cookie Authentication:**

All API calls use HttpOnly cookies instead of localStorage tokens:

```typescript
// CORRECT Pattern:
fetch("/api/endpoint", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Sends HttpOnly cookies!
  body: JSON.stringify(data),
});

// WRONG Pattern (DO NOT USE):
const token = localStorage.getItem("accessToken");
fetch(`${API_URL}/endpoint`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

**Key Points:**

- Use relative URLs (`/api/...`) not absolute URLs
- Always include `credentials: "include"`
- NO Authorization headers
- NO localStorage token access

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

### Project Filtering Logic

**Backend Service Layer:**

**Status Filter:**

```go
if status != "" {
    query = query.Where("status = ?", status)
}
```

**Tech Stack Filter:**

```go
if len(techStackIDs) > 0 {
    query = query.Joins("JOIN project_tech_stack ON projects.id = project_tech_stack.project_id").
                  Where("project_tech_stack.tech_stack_item_id IN ?", techStackIDs).
                  Group("projects.id")
}
```

**Frontend:**

- Status filter: Single select (one status at a time)
- Tech Stack filter: Multi-select (multiple items)
- Both filters can be combined

### Progress Calculation

**Backend (Go):**

```go
func (p *Project) GetProgress() int {
    if len(p.Tasks) == 0 {
        return 0
    }
    completed := 0
    for _, pt := range p.Tasks {
        if pt.Task != nil && pt.Task.Status == "Done" {
            completed++
        }
    }
    return (completed * 100) / len(p.Tasks)
}
```

Calculated dynamically on fetch, included in API response.

**Frontend:**

- Uses `project.tasks` array length
- Counts tasks with `status === "Done"`
- Displays as percentage with progress bar

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
- Project store: localStorage key = `'project-storage'`
- Automatic save on state changes
- Automatic load on app mount
- Syncs between tabs/windows

### API Integration Pattern

**Example: Creating a Project**

```javascript
// 1. API function (lib/api/projects.ts)
export async function createProject(data: CreateProjectRequest) {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return response.json();
}

// 2. Store action (lib/store/project-store.ts)
createProject: async (data) => {
  const result = await apiCreateProject(data);
  set((state) => ({
    projects: [...state.projects, result.project],
  }));
};

// 3. Component usage
const { createProject } = useProjectStore();
await createProject({ title, description, status, techStackIds });
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
- **Icon System**: Lucide React icons with consistent sizing (w-4 h-4 for small, w-5 h-5 for medium)

### Filter Sidebar Pattern

**Consistent Design Across All Modules:**

- Icons + Colors for each option
- Hover effects on all buttons
- Active state: `bg-primary/10 border-primary`
- Inactive state: `border-border hover:border-primary/50`
- Clean section headers
- No "Active Filters" summary section

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

**`projects`:**

- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users.id)
- `title` (VARCHAR, required)
- `description` (TEXT, required)
- `status` (VARCHAR: Idea/Planning/Active/Debugging/Testing/OnHold/Finished/Abandoned)
- `repository_url` (VARCHAR, nullable)
- `created_at`, `updated_at` (TIMESTAMP)

**`project_tasks`** (Join Table):

- `id` (UUID, primary key)
- `project_id` (UUID, foreign key → projects.id)
- `task_id` (UUID, foreign key → tasks.id)
- `created_at` (TIMESTAMP)

**`categories`:**

- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users.id)
- `name` (VARCHAR, required)
- `created_at`, `updated_at` (TIMESTAMP)

**`tech_stack_items`:**

- `id` (UUID, primary key)
- `category_id` (UUID, foreign key → categories.id)
- `user_id` (UUID, foreign key → users.id)
- `name` (VARCHAR, required)
- `created_at`, `updated_at` (TIMESTAMP)

**`project_tech_stack`** (Many-to-Many Join Table - Auto-created by GORM):

- `project_id` (UUID, foreign key → projects.id)
- `tech_stack_item_id` (UUID, foreign key → tech_stack_items.id)

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
  - Filter system (Domain + Time + Status) with Icons
  - Persistent state management

- Sprint 4: Daily Routines System

  - Backend: Complete CRUD + Frequency-based filtering
  - Frontend: Full routines page with 3-column layout
  - Dashboard Widget: Today's Routines Widget
  - Streak tracking with completion/skip actions
  - Today's routines matching (frequency-aware)
  - Filter system (Frequency-based)
  - Persistent state management

- Sprint 5: Project Management System
  - Backend: Complete CRUD + Advanced Filtering (Status, TechStack)
  - Frontend: Full projects page with 3-column layout
  - Dashboard Widget: Featured Project Widget with:
    - Multi-level Quick Add (New Project/Task/Assign Task)
    - Project Selection via Settings
    - Task assignment/unassignment
    - Progress calculation & display
  - Filter system (Status + Tech Stack) with Icons
  - Tech Stack Management (Categories + Items)
  - Settings Page with Tech Stack Manager
  - Many-to-many relationships (Project ↔ TechStack, Project ↔ Tasks)
  - Persistent state management

### ⏳ Pending Implementation:

- Other dashboard widgets (per Stand document)
- Remaining sidebar modules (Schedule, University, etc.)
- Rich text editor integration (TipTap installed but unused)
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
- Many-to-many relationships easily handled by GORM
- HttpOnly cookies more secure than localStorage tokens
- Consistent filter sidebar design improves UX across modules
- Multi-level dialogs enable complex workflows
- Progress calculation should be server-side for accuracy

---

## 📄 License

Personal Project - Not for commercial use

---

**This documentation provides complete context for continuing development. The project follows modern best practices, clean architecture patterns, and provides a solid foundation for adding new features.**# MyLifeOS v1.5 - Stand der Implementierung

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
│   │   │   ├── routine_completion.go
│   │   │   ├── project.go
│   │   │   ├── project_task.go
│   │   │   ├── category.go
│   │   │   └── tech_stack_item.go
│   │   └── interfaces/                 # Interface definitions
│   │       ├── repositories.go         # Repository interfaces
│   │       └── services.go             # Service interfaces
│   ├── repository/postgres/            # Data access layer
│   │   ├── user_repository.go
│   │   ├── token_repository.go
│   │   ├── task_repository.go
│   │   ├── routine_repository.go
│   │   ├── project_repository.go
│   │   ├── category_repository.go
│   │   └── tech_stack_item_repository.go
│   ├── service/                        # Business logic
│   │   ├── auth_service.go
│   │   ├── task_service.go
│   │   ├── routine_service.go
│   │   ├── project_service.go
│   │   ├── category_service.go
│   │   └── tech_stack_item_service.go
│   ├── handler/http/                   # HTTP handlers
│   │   ├── auth_handler.go
│   │   ├── task_handler.go
│   │   ├── routine_handler.go
│   │   ├── project_handler.go
│   │   ├── category_handler.go
│   │   └── tech_stack_item_handler.go
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
│   ├── projects/
│   │   └── page.tsx                    # Project Manager Seite
│   └── settings/
│       └── page.tsx                    # Settings Seite
│
├── components/
│   ├── auth-guard.tsx                  # Protected route wrapper
│   ├── sidebar.tsx                     # Sliding Overlay Navigation
│   ├── burger-menu.tsx                 # Mobile Menu Toggle
│   │
│   ├── dashboard/
│   │   ├── weekly-task-board.tsx       # Task Widget für Dashboard
│   │   ├── todays-routines-widget.tsx  # Daily Routines Widget
│   │   ├── week-ahead-widget.tsx       # Week Preview Widget
│   │   └── featured-project-widget.tsx # Featured Project Widget
│   │
│   ├── tasks/
│   │   ├── quick-add-dialog.tsx        # Schnelles Task Erstellen
│   │   ├── task-detail-view.tsx        # Detailansicht (Rechts)
│   │   ├── task-detail-modal.tsx       # Modal für Dashboard Widget
│   │   ├── task-list.tsx               # Task Liste
│   │   ├── task-item.tsx               # Einzelner Task in Liste
│   │   └── task-filter-sidebar.tsx     # Domain/Time/Status Filter
│   │
│   ├── routines/
│   │   ├── quick-add-dialog.tsx        # Schnelles Routine Erstellen
│   │   ├── routine-detail-view.tsx     # Detailansicht (Rechts)
│   │   ├── routines-list.tsx           # Routine Liste
│   │   ├── routine-item.tsx            # Einzelne Routine in Liste
│   │   └── routine-filter-sidebar.tsx  # Frequency Filter
│   │
│   ├── projects/
│   │   ├── quick-add-dialog.tsx        # Schnelles Project Erstellen
│   │   ├── project-detail-view.tsx     # Detailansicht (Rechts)
│   │   ├── project-list.tsx            # Project Liste
│   │   ├── project-item.tsx            # Einzelnes Project in Liste
│   │   └── project-filter-sidebar.tsx  # Status/TechStack Filter
│   │
│   └── settings/
│       └── tech-stack-manager-dialog.tsx # Tech Stack Management
│
├── lib/
│   ├── utils.ts                        # Utility functions
│   ├── api/
│   │   ├── auth.ts                     # Auth API functions
│   │   ├── tasks.ts                    # Task API functions
│   │   ├── routines.ts                 # Routine API functions
│   │   ├── projects.ts                 # Project API functions
│   │   ├── categories.ts               # Category API functions
│   │   └── tech-stack-items.ts         # Tech Stack Item API functions
│   └── store/
│       ├── auth-store.ts               # Zustand auth state
│       ├── task-store.ts               # Zustand Task State Management
│       ├── routine-store.ts            # Zustand Routine State Management
│       ├── project-store.ts            # Zustand Project State Management
│       ├── category-store.ts           # Zustand Category State Management
│       └── tech-stack-store.ts         # Zustand Tech Stack State Management
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
- Project
- ProjectTask (join table)
- Category
- TechStackItem

```go
type Project struct {
    ID             uuid.UUID       `gorm:"type:uuid;primary_key" json:"id"`
    UserID         uuid.UUID       `gorm:"type:uuid;not null" json:"userId"`
    Title          string          `gorm:"type:varchar(255);not null" json:"title"`
    Description    string          `gorm:"type:text;not null" json:"description"`
    Status         string          `gorm:"type:varchar(50);not null" json:"status"`
    RepositoryUrl  *string         `gorm:"type:varchar(500)" json:"repositoryUrl"`
    TechStack      []TechStackItem `gorm:"many2many:project_tech_stack;" json:"techStack"`
    Tasks          []ProjectTask   `gorm:"foreignKey:ProjectID" json:"tasks"`
    CreatedAt      time.Time       `gorm:"not null" json:"createdAt"`
    UpdatedAt      time.Time       `gorm:"not null" json:"updatedAt"`
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
    &entities.Project{},
    &entities.ProjectTask{},
    &entities.Category{},
    &entities.TechStackItem{}
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

- **Time Filters** (with Icons + Colors):

  - ∞ All Tasks (Gray)
  - ⚠️ Overdue (Red)
  - 🕐 Today (Blue)
  - 📅 Tomorrow (Green)
  - 📆 Next Week (Purple)
  - 🗓️ Next Month (Orange)
  - ⏳ Long Term (Slate)

- **Domain Filters** (with Icons + Colors):

  - 💼 Work (Blue)
  - 🎓 University (Purple)
  - 💻 Coding Project (Green)
  - 💡 Personal Project (Yellow)
  - 🎯 Goals (Red)
  - 💰 Finances (Emerald)
  - 🏠 Household (Orange)
  - ❤️ Health (Pink)

- **Completion Filter** (with Icons):
  - ○ To do (Blue)
  - ✓ Done (Green)

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
  ┌──────────┬──────────┬──────────┐
  │ Priority │  Domain  │ Deadline │  (3 columns with icons)
  └──────────┴──────────┴──────────┘
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
- Fields: Title (required), Description, Priority dropdown, Domain dropdown, Deadline date picker
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
  | "overdue"
  | "today"
  | "tomorrow"
  | "next_week"
  | "next_month"
  | "long_term";

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

### 4. Project Management System (Sprint 5)

#### Backend Implementation

**Entity Definitions:**

**Project** (`internal/domain/entities/project.go`):

```go
type Project struct {
    ID            uuid.UUID       `gorm:"type:uuid;primary_key" json:"id"`
    UserID        uuid.UUID       `gorm:"type:uuid;not null" json:"userId"`
    Title         string          `gorm:"type:varchar(255);not null" json:"title"`
    Description   string          `gorm:"type:text;not null" json:"description"`
    Status        string          `gorm:"type:varchar(50);not null" json:"status"`
    RepositoryUrl *string         `gorm:"type:varchar(500)" json:"repositoryUrl"`

    // Relationships
    TechStack     []TechStackItem `gorm:"many2many:project_tech_stack;" json:"techStack"`
    Tasks         []ProjectTask   `gorm:"foreignKey:ProjectID" json:"tasks"`

    // Timestamps
    CreatedAt     time.Time       `gorm:"not null" json:"createdAt"`
    UpdatedAt     time.Time       `gorm:"not null" json:"updatedAt"`
}

// Method to calculate progress
func (p *Project) GetProgress() int {
    if len(p.Tasks) == 0 {
        return 0
    }
    completed := 0
    for _, pt := range p.Tasks {
        if pt.Task != nil && pt.Task.Status == "Done" {
            completed++
        }
    }
    return (completed * 100) / len(p.Tasks)
}
```

**ProjectTask** (Join Table - `internal/domain/entities/project_task.go`):

```go
type ProjectTask struct {
    ID        uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
    ProjectID uuid.UUID `gorm:"type:uuid;not null" json:"projectId"`
    TaskID    uuid.UUID `gorm:"type:uuid;not null" json:"taskId"`
    Task      *Task     `gorm:"foreignKey:TaskID" json:"task"`
    CreatedAt time.Time `gorm:"not null" json:"createdAt"`
}
```

**Category** (`internal/domain/entities/category.go`):

```go
type Category struct {
    ID        uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
    UserID    uuid.UUID `gorm:"type:uuid;not null" json:"userId"`
    Name      string    `gorm:"type:varchar(100);not null" json:"name"`
    CreatedAt time.Time `gorm:"not null" json:"createdAt"`
    UpdatedAt time.Time `gorm:"not null" json:"updatedAt"`
}
```

**TechStackItem** (`internal/domain/entities/tech_stack_item.go`):

```go
type TechStackItem struct {
    ID         uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
    CategoryID uuid.UUID `gorm:"type:uuid;not null" json:"categoryId"`
    UserID     uuid.UUID `gorm:"type:uuid;not null" json:"userId"`
    Name       string    `gorm:"type:varchar(100);not null" json:"name"`
    CreatedAt  time.Time `gorm:"not null" json:"createdAt"`
    UpdatedAt  time.Time `gorm:"not null" json:"updatedAt"`
}
```

- GORM creates `projects`, `project_tasks`, `project_tech_stack` (many2many), `categories`, and `tech_stack_items` tables
- Many-to-many relationships handled automatically by GORM

**Service Layer Logic:**

**Projects:**

- Complete CRUD operations
- Advanced filtering by Status and TechStack
- Progress calculation (completed tasks / total tasks)
- Task assignment/unassignment
- TechStack management (many-to-many)

**Categories:**

- CRUD operations for organizing tech stack items
- User-specific categories

**TechStackItems:**

- CRUD operations
- Category-based filtering
- Reusable across multiple projects

**API Endpoints:**

```
# Projects
GET    /api/projects                    - Get all projects (with filters)
       ?status=Active                   - Filter by status
       &techStackIds=uuid1,uuid2        - Filter by tech stack items
POST   /api/projects                    - Create new project
GET    /api/projects/:id                - Get single project
PUT    /api/projects/:id                - Update project
DELETE /api/projects/:id                - Delete project

# Project-Task Assignment
POST   /api/projects/:id/tasks          - Assign task to project
       Body: { taskId: "uuid" }
DELETE /api/projects/:id/tasks/:taskId  - Unassign task from project
GET    /api/projects/:id/tasks          - Get all tasks assigned to project

# Categories
GET    /api/categories                  - Get all categories
POST   /api/categories                  - Create category
       Body: { name: "string" }
GET    /api/categories/:id              - Get single category
PUT    /api/categories/:id              - Update category
DELETE /api/categories/:id              - Delete category

# Tech Stack Items
GET    /api/tech-stack                  - Get all tech stack items
       ?categoryId=uuid                 - Filter by category
POST   /api/tech-stack                  - Create tech stack item
       Body: { name: "string", categoryId: "uuid" }
GET    /api/tech-stack/:id              - Get single item
PUT    /api/tech-stack/:id              - Update item
DELETE /api/tech-stack/:id              - Delete item
```

#### Frontend Implementation

**Page Layout** (`/projects`):

```
┌─────────────┬────────────────────┬──────────────┐
│   Sidebar   │   Project List     │ Detail View  │
│  (Filters)  │  (with New Button) │   (Always)   │
│   280px     │       1fr          │    450px     │
└─────────────┴────────────────────┴──────────────┘
```

**Filter Sidebar** (`project-filter-sidebar.tsx`):

- **Status Filters** (with Icons + Colors):

  - 💡 Idea (Gray)
  - 📋 Planning (Blue)
  - ⚡ Active (Green)
  - 🐛 Debugging (Yellow)
  - 🧪 Testing (Orange)
  - ⏸️ OnHold (Purple)
  - ✅ Finished (Emerald)
  - ❌ Abandoned (Slate)

- **Tech Stack Filters** (Multi-Select):
  - Grouped by Categories
  - Toggle selection for each item
  - Shows selected count

**Project List** (`project-list.tsx`):

- Shows all projects (or filtered)
- Stats: "X projects" count
- New Project button opens Quick Add Dialog

**Project Item** (`project-item.tsx`):

- Status Badge (colored)
- Title
- Description preview (truncated)
- Progress Bar (X/Y tasks - Z%)
- Tech Stack Badges (max 4 + "X more")
- Click → Selects project for detail view

**Project Detail View** (`project-detail-view.tsx`):

- Fixed right panel (450px, always visible)
- Shows selected project details

**Layout:**

```
  Title ........................... [Status Badge]

  [Tech Stack Badges: React, Next.js, TypeScript, Go]

  Description

  Repository

  Progress
  ┌────────────────────────────┐
  │ ████████░░░░░░░░░░ 40%     │
  └────────────────────────────┘

  Assigned Tasks (5)
  - Task 1 [Priority] [Domain] [Deadline]
  - Task 2 [Priority] [Domain] [Deadline]

  ┌──────────┬──────────┐
  │ Created  │ Updated  │
  └──────────┴──────────┘
```

**Edit Mode:**

- Toggle with "Edit Project" button
- All fields editable:
  - Title (text input)
  - Description (textarea)
  - Status (dropdown)
  - Repository URL (text input)
  - Tech Stack (multi-select dialog)
  - Assigned Tasks (assignment dialog)
- Save/Cancel buttons
- Delete button with confirmation

**Quick Add Dialog** (`quick-add-dialog.tsx`):

- Modal for fast project creation
- **Required Fields:**
  - Title (text input)
  - Description (textarea)
- **Optional Fields:**
  - Status (dropdown, default: "Idea")
  - Repository URL (text input)
  - Tech Stack (multi-select, grouped by categories)
- Create button
- Closes on success

**State Management** (`project-store.ts`):

Interface:

```typescript
- projects: Project[]
- selectedProject: Project | null
- projectTasks: ProjectTask[]
- isLoading: boolean
- error: string | null
- statusFilter: ProjectStatus | null
- techStackFilter: string[]
```

Actions:

- `fetchProjects()`
- `fetchProjectsWithFilters(status?, techStackIds?)`
- `createProject(data)`
- `updateProject(id, data)`
- `deleteProject(id)`
- `selectProject(project)`
- `assignTask(projectId, taskId)`
- `unassignTask(projectId, taskId)`
- `fetchProjectTasks(projectId)`
- `setStatusFilter(status)`
- `setTechStackFilter(ids)`
- `clearFilters()`

Persistence:

- localStorage key: `'project-storage'`
- Auto-saves on every change

**TypeScript Types** (`types/index.ts`):

```typescript
type ProjectStatus =
  | "Idea"
  | "Planning"
  | "Active"
  | "Debugging"
  | "Testing"
  | "OnHold"
  | "Finished"
  | "Abandoned";

interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  repositoryUrl?: string;
  techStack?: TechStackItem[];
  tasks?: ProjectTask[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectTask {
  id: string;
  projectId: string;
  taskId: string;
  task?: Task;
  createdAt: string;
}

interface Category {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface TechStackItem {
  id: string;
  categoryId: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateProjectRequest {
  title: string;
  description: string;
  status: ProjectStatus;
  repositoryUrl?: string;
  techStackIds: string[];
}

interface AssignTaskRequest {
  taskId: string;
}
```

---

### 5. Dashboard (`/dashboard`)

**Layout:**

- Dynamic greeting: "Guten Morgen/Tag/Abend/Noch wach, Alex"
- Current date in German: "Mittwoch, der 7. Januar 2026"
- Gradient header with decorative line
- Widget grid layout
- Proper padding: `px-36 pr-16`

#### Week Ahead Widget (`week-ahead-widget.tsx`)

**Layout:** Full width above grid

**Header:**

- Calendar icon
- "Week Ahead" title
- Expand/Collapse toggle

**Features:**

- Shows upcoming week overview
- Independent expand/collapse state

#### Widget Grid (3 columns)

```
┌─────────────┬─────────────┬─────────────┐
│   Task      │  Routines   │  Featured   │
│   Board     │   Widget    │  Project    │
└─────────────┴─────────────┴─────────────┘
```

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

#### Featured Project Widget (`featured-project-widget.tsx`)

**Header:**

- Folder icon (FolderKanban)
- "Featured Project" title
- Progress badge (when collapsed): "X/Y (Z%)"
- "+" Quick Add button (ALWAYS visible)
- ⚙️ Settings button (Select Featured Project)
- Expand/Collapse toggle

**Default State:** Collapsed

**Quick Add Menu (Multi-Level):**

Click on "+" → Opens Action Selection Menu:

```
┌─────────────────────────────┐
│ Quick Add                   │
├─────────────────────────────┤
│ [📁] New Project            │  ← Blue
│     Create a new project    │
│                             │
│ [✚] New Task                │  ← Green
│     Create a completely...  │
│                             │
│ [🔗] Assign Existing Task   │  ← Purple
│     Add a task to this...   │
└─────────────────────────────┘
```

**Sub-Dialogs:**

1. **New Project Dialog:**

   - Title (required)
   - Description (required, textarea)
   - Status (dropdown: Idea/Planning/Active/etc.)
   - Repository URL (optional)
   - Tech Stack (multi-select, grouped by categories)
   - Creates project (not auto-featured)

2. **New Task Dialog:**

   - Title (required)
   - Description (optional, textarea)
   - Priority (dropdown)
   - Domain (dropdown)
   - Deadline (date picker)
   - Creates completely NEW task

3. **Assign Existing Task Dialog:**
   - Search bar for tasks
   - Shows available tasks (not already assigned)
   - Each task shows: Title, Priority, Domain, Deadline
   - Click task → Assigns to featured project
   - Auto-filters out already assigned tasks

**Project Selection (Settings Icon):**

Click on ⚙️ → Opens Project Selector Modal:

- Lists all projects
- Shows: Title, Status Badge, Task Count
- Selected project has ✓ checkmark
- Click project → Updates featured project
- Saved in localStorage (`featuredProjectId`)

**Fallback Logic:**

- If no project selected → Shows most recently updated project
- If selected project deleted → Fallback to most recent

**When Expanded:**

Layout:

```
Title ........................... [Status Badge]

[Tech Stack: React, Next.js, Go, PostgreSQL]

Description
(scrollable, max-height: 96px)

Repository
https://github.com/...

Progress
X / Y tasks completed        Z%
┌────────────────────────────┐
│ ████████░░░░░░░░░░         │
└────────────────────────────┘

Assigned Tasks (Y)
(scrollable, max-height: 192px)
- Task 1 [Priority] [Domain] [Deadline]
- Task 2 [Priority] [Domain] [Deadline]

[View Full Project] Button
```

**Features:**

- Click Task → Opens Full TaskDetailModal (Edit/Delete/Mark Done)
- Repository link opens in new tab
- Progress bar with animation
- Clean, simple design (no gradients)
- Scrollable sections (Description, Tasks)

**State:**

- localStorage key: `'featuredProjectId'`
- Independent expand/collapse (not synced with other widgets)

---

### 6. Settings Page (`/settings`)

**Layout:**

Single large box container (like Tasks/Projects pages):

```
┌─────────────────────────────────┐
│ ⚙️ Settings                     │
├─────────────────────────────────┤
│                                 │
│ Tech Stack Management           │
│ [Manage Categories & Items]     │
│                                 │
└─────────────────────────────────┘
```

**Tech Stack Management Dialog:**

Opens full-screen modal for managing:

1. **Categories:**

   - Create category
   - Edit category name
   - Delete category (with items warning)

2. **Tech Stack Items:**
   - Create item (select category)
   - Edit item name
   - Move item to different category
   - Delete item (with projects warning)

**Features:**

- Grouped display by category
- Drag-and-drop reordering (future)
- Validation (no empty names)
- Cascade warnings (deleting category with items)

---

### 7. Navigation System

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
  ├── Projects  ← NEW!
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

⚙️ Settings  ← NEW!
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
- Project
- ProjectTask (join table)
- Category
- TechStackItem

**Many-to-Many Relationships:**

```go
type Project struct {
    TechStack []TechStackItem `gorm:"many2many:project_tech_stack;" json:"techStack"`
}
```

GORM automatically creates `project_tech_stack` join table with:

- `project_id` (UUID)
- `tech_stack_item_id` (UUID)

### Authentication Pattern

**HttpOnly Cookie Authentication:**

All API calls use HttpOnly cookies instead of localStorage tokens:

```typescript
// CORRECT Pattern:
fetch("/api/endpoint", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Sends HttpOnly cookies!
  body: JSON.stringify(data),
});

// WRONG Pattern (DO NOT USE):
const token = localStorage.getItem("accessToken");
fetch(`${API_URL}/endpoint`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

**Key Points:**

- Use relative URLs (`/api/...`) not absolute URLs
- Always include `credentials: "include"`
- NO Authorization headers
- NO localStorage token access

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

### Project Filtering Logic

**Backend Service Layer:**

**Status Filter:**

```go
if status != "" {
    query = query.Where("status = ?", status)
}
```

**Tech Stack Filter:**

```go
if len(techStackIDs) > 0 {
    query = query.Joins("JOIN project_tech_stack ON projects.id = project_tech_stack.project_id").
                  Where("project_tech_stack.tech_stack_item_id IN ?", techStackIDs).
                  Group("projects.id")
}
```

**Frontend:**

- Status filter: Single select (one status at a time)
- Tech Stack filter: Multi-select (multiple items)
- Both filters can be combined

### Progress Calculation

**Backend (Go):**

```go
func (p *Project) GetProgress() int {
    if len(p.Tasks) == 0 {
        return 0
    }
    completed := 0
    for _, pt := range p.Tasks {
        if pt.Task != nil && pt.Task.Status == "Done" {
            completed++
        }
    }
    return (completed * 100) / len(p.Tasks)
}
```

Calculated dynamically on fetch, included in API response.

**Frontend:**

- Uses `project.tasks` array length
- Counts tasks with `status === "Done"`
- Displays as percentage with progress bar

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
- Project store: localStorage key = `'project-storage'`
- Automatic save on state changes
- Automatic load on app mount
- Syncs between tabs/windows

### API Integration Pattern

**Example: Creating a Project**

```javascript
// 1. API function (lib/api/projects.ts)
export async function createProject(data: CreateProjectRequest) {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return response.json();
}

// 2. Store action (lib/store/project-store.ts)
createProject: async (data) => {
  const result = await apiCreateProject(data);
  set((state) => ({
    projects: [...state.projects, result.project],
  }));
};

// 3. Component usage
const { createProject } = useProjectStore();
await createProject({ title, description, status, techStackIds });
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
- **Icon System**: Lucide React icons with consistent sizing (w-4 h-4 for small, w-5 h-5 for medium)

### Filter Sidebar Pattern

**Consistent Design Across All Modules:**

- Icons + Colors for each option
- Hover effects on all buttons
- Active state: `bg-primary/10 border-primary`
- Inactive state: `border-border hover:border-primary/50`
- Clean section headers
- No "Active Filters" summary section

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

**`projects`:**

- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users.id)
- `title` (VARCHAR, required)
- `description` (TEXT, required)
- `status` (VARCHAR: Idea/Planning/Active/Debugging/Testing/OnHold/Finished/Abandoned)
- `repository_url` (VARCHAR, nullable)
- `created_at`, `updated_at` (TIMESTAMP)

**`project_tasks`** (Join Table):

- `id` (UUID, primary key)
- `project_id` (UUID, foreign key → projects.id)
- `task_id` (UUID, foreign key → tasks.id)
- `created_at` (TIMESTAMP)

**`categories`:**

- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users.id)
- `name` (VARCHAR, required)
- `created_at`, `updated_at` (TIMESTAMP)

**`tech_stack_items`:**

- `id` (UUID, primary key)
- `category_id` (UUID, foreign key → categories.id)
- `user_id` (UUID, foreign key → users.id)
- `name` (VARCHAR, required)
- `created_at`, `updated_at` (TIMESTAMP)

**`project_tech_stack`** (Many-to-Many Join Table - Auto-created by GORM):

- `project_id` (UUID, foreign key → projects.id)
- `tech_stack_item_id` (UUID, foreign key → tech_stack_items.id)

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
  - Filter system (Domain + Time + Status) with Icons
  - Persistent state management

- Sprint 4: Daily Routines System

  - Backend: Complete CRUD + Frequency-based filtering
  - Frontend: Full routines page with 3-column layout
  - Dashboard Widget: Today's Routines Widget
  - Streak tracking with completion/skip actions
  - Today's routines matching (frequency-aware)
  - Filter system (Frequency-based)
  - Persistent state management

- Sprint 5: Project Management System
  - Backend: Complete CRUD + Advanced Filtering (Status, TechStack)
  - Frontend: Full projects page with 3-column layout
  - Dashboard Widget: Featured Project Widget with:
    - Multi-level Quick Add (New Project/Task/Assign Task)
    - Project Selection via Settings
    - Task assignment/unassignment
    - Progress calculation & display
  - Filter system (Status + Tech Stack) with Icons
  - Tech Stack Management (Categories + Items)
  - Settings Page with Tech Stack Manager
  - Many-to-many relationships (Project ↔ TechStack, Project ↔ Tasks)
  - Persistent state management

### ⏳ Pending Implementation:

- Other dashboard widgets (per Stand document)
- Remaining sidebar modules (Schedule, University, etc.)
- Rich text editor integration (TipTap installed but unused)
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
- Many-to-many relationships easily handled by GORM
- HttpOnly cookies more secure than localStorage tokens
- Consistent filter sidebar design improves UX across modules
- Multi-level dialogs enable complex workflows
- Progress calculation should be server-side for accuracy

---

## 📄 License

Personal Project - Not for commercial use

---

**This documentation provides complete context for continuing development. The project follows modern best practices, clean architecture patterns, and provides a solid foundation for adding new features.**
