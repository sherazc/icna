# Scheduling System - Entity Relationships

## Core Tables Overview

### 1. Clinic Operations
```
clinic_operation_date
├── id (PK)
├── company_id (FK → company)
├── operation_date
├── start_time
├── end_time
├── status (SCHEDULED, CONFIRMED, CANCELLED, COMPLETED)
└── notes
```

### 2. Availability Patterns (Enum)
**Kotlin Enum Class - No Database Table**
```
AvailabilityPattern (ENUM)
├── WEEKENDS
├── SATURDAY
├── SUNDAY
├── ANY_DAY
└── SPECIFIC_DATE

Each enum value contains:
- patternCode: String
- patternName: String
- description: String
```

### 3. Provider Availability
```
provider_availability_pattern          provider_availability_date
├── id (PK)                           ├── id (PK)
├── provider_id (FK → provider)       ├── provider_id (FK → provider)
├── availability_pattern (ENUM)       ├── availability_date
├── is_active                         ├── is_available (true/false)
├── start_date                        ├── start_time
├── end_date                          ├── end_time
└── notes                             └── notes
```

### 4. Employee Availability
```
employee_availability_pattern            employee_availability_date
├── id (PK)                           ├── id (PK)
├── employee_id (FK → employee)       ├── employee_id (FK → employee)
├── availability_pattern (ENUM)       ├── availability_date
├── is_active                         ├── is_available (true/false)
├── start_date                        ├── start_time
├── end_date                          ├── end_time
└── notes                             └── notes
```

### 5. Schedule Assignments
```
clinic_schedule_provider               clinic_schedule_employee
├── id (PK)                           ├── id (PK)
├── clinic_operation_date_id (FK)     ├── clinic_operation_date_id (FK)
├── provider_id (FK → provider)       ├── worker_id (FK → worker)
├── assignment_status                 ├── assignment_status
├── start_time                        ├── start_time
├── end_time                          ├── end_time
├── notes                             ├── notes
├── assigned_by (FK → user_profile)   ├── assigned_by (FK → user_profile)
├── assigned_at                       ├── assigned_at
└── confirmed_at                      └── confirmed_at
```

## Relationship Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        AVAILABILITY LAYER                         │
└──────────────────────────────────────────────────────────────────┘

provider/worker
    ↓
    ├─→ availability_pattern (ENUM: "WEEKENDS", "SATURDAY", etc.)
    │       - No database table needed
    │       - Type-safe Kotlin enum
    │       - Contains patternCode, patternName, description
    │
    └─→ availability_date tables (specific dates/exceptions)
            provider_availability_date
            worker_availability_date


┌──────────────────────────────────────────────────────────────────┐
│                        SCHEDULING LAYER                           │
└──────────────────────────────────────────────────────────────────┘

clinic_operation_date (when clinic is open)
    ↓
    └─→ clinic_schedule_provider/worker (who is assigned)
            ↓
            └─→ provider/worker (the actual person)
```

## Data Flow: From Availability to Schedule

```
Step 1: DECLARE AVAILABILITY
    Provider says: "I'm available weekends"
    → INSERT into provider_availability_pattern (availability_pattern = 'WEEKENDS')

Step 2: CREATE CLINIC DATE
    Admin creates: "Jan 24, 2026 (Saturday)"
    → INSERT into clinic_operation_date

Step 3: FIND AVAILABLE STAFF
    System queries:
    → Check provider_availability_pattern (availability_pattern = 'WEEKENDS'? YES)
    → Check provider_availability_date (any exceptions? NO)
    → Result: Provider is available

Step 4: ASSIGN TO SCHEDULE
    Admin assigns provider to Jan 24
    → INSERT into clinic_schedule_provider (status = ASSIGNED)

Step 5: CONFIRM
    Provider confirms
    → UPDATE clinic_schedule_provider (status = CONFIRMED)
```

## Example Scenario

### Scenario: Scheduling for Saturday, Jan 24, 2026

**Who's Available?**

```
✅ Dr. John Smith
   Pattern: WEEKENDS → Matches (Saturday is weekend)
   
✅ Dr. Sarah Johnson  
   Pattern: SATURDAY → Matches (is Saturday)
   
⚠️  Dr. Michael Williams
   Pattern: ANY_DAY → Matches
   BUT specific date: Jan 24, 9am-1pm only (limited hours)
   
✅ Nurse Jennifer Davis
   Pattern: WEEKENDS → Matches
   
❌ Receptionist Robert Miller
   Pattern: SUNDAY → No match (not Sunday)
   
✅ Medical Assistant Jessica Wilson
   Pattern: SPECIFIC_DATE + date entry for Jan 24 → Matches
```

**Final Schedule:**
```
clinic_operation_date: Jan 24, 2026, 9am-5pm

clinic_schedule_provider:
  - Dr. Smith (9am-5pm) - CONFIRMED
  - Dr. Johnson (9am-5pm) - CONFIRMED
  
clinic_schedule_employee:
  - Nurse Davis (9am-5pm) - CONFIRMED
  - Med Assistant Wilson (9am-5pm) - ASSIGNED (pending)
```

## Key Design Principles

1. **Separation of Concerns**
   - Availability tables = What's possible
   - Schedule tables = What's actual

2. **Flexibility**
   - Patterns for common availability
   - Specific dates for one-offs
   - Exceptions via is_available=false

3. **Status Tracking**
   - Assignment lifecycle: ASSIGNED → CONFIRMED/DECLINED/CANCELLED
   - Timestamps for audit trail

4. **Referential Integrity**
   - Foreign keys ensure valid relationships
   - Cascade/restrict rules protect data

## Query Pattern: Find Available Providers

```sql
-- Find providers available on a given date (e.g., Saturday Jan 24, 2026)
SELECT DISTINCT p.*
FROM provider p
WHERE p.id IN (
    -- Match by pattern (no JOIN needed with enum!)
    SELECT pap.provider_id
    FROM provider_availability_pattern pap
    WHERE pap.is_active = true
      AND pap.availability_pattern IN ('WEEKENDS', 'SATURDAY', 'ANY_DAY')
      AND (pap.start_date IS NULL OR pap.start_date <= '2026-01-24')
      AND (pap.end_date IS NULL OR pap.end_date >= '2026-01-24')
    
    UNION
    
    -- Match by specific date
    SELECT pda.provider_id
    FROM provider_availability_date pda
    WHERE pda.availability_date = '2026-01-24'
      AND pda.is_available = true
)
AND p.id NOT IN (
    -- Exclude exceptions (marked unavailable)
    SELECT provider_id
    FROM provider_availability_date
    WHERE availability_date = '2026-01-24'
      AND is_available = false
);
```

**Benefits of Enum Approach:**
- ✅ No JOIN needed - simpler and faster query
- ✅ Type-safe enum values prevent typos
- ✅ Pattern metadata (name, description) available in code without database lookup

This design provides maximum flexibility while maintaining data integrity and clear relationships between all entities.

