# Scheduling System - Entity Relationships

## Core Tables Overview

### 1. Company Operations
```
company_operation_date
├── id (PK)
├── company_id (FK → company)
├── operation_date
├── start_time
├── end_time
├── status (SCHEDULED, CONFIRMED, CANCELLED, COMPLETED)
├── notes
├── created_at
└── updated_at
```

### 2. Employee Schedule
```
employee_schedule
├── id (PK)
├── company_operation_date_id (FK → company_operation_date)
├── employee_id (FK → employee)
├── assignment_status (ASSIGNED, CONFIRMED, DECLINED, CANCELLED)
├── start_time
├── end_time
├── notes
├── assigned_by (FK → user_profile)
├── assigned_at
└── confirmed_at
```

### 3. Employee (Unified)
```
employee
├── id (PK)
├── first_name
├── last_name
├── email
├── phone_number
├── company_id (FK → company)
└── employeeTypes (ManyToMany → employee_type)
```

### 4. Employee Type
```
employee_type
├── id (PK)
├── type_name
└── employee_type_group (ENUM: PROVIDER | VOLUNTEER)
```

## Relationship Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        SCHEDULING LAYER                           │
└──────────────────────────────────────────────────────────────────┘

company_operation_date (when company is open)
    ↓
    └─→ employee_schedule (who is assigned)
            ↓
            └─→ employee (the actual person)
                    ↓
                    └─→ employee_type (provider or volunteer roles)
```

## Data Flow: Simplified Assignment

```
Step 1: CREATE OPERATION DATE
    Admin creates: "Jan 24, 2026 (Saturday), 9am-5pm"
    → INSERT into company_operation_date (status = 'SCHEDULED')

Step 2: ASSIGN EMPLOYEES
    Admin assigns employees directly to the operation date:
    → INSERT into employee_schedule (employee_id, company_operation_date_id, status = 'ASSIGNED')

Step 3: EMPLOYEES CONFIRM
    Employees confirm or decline:
    → UPDATE employee_schedule (status = 'CONFIRMED' or 'DECLINED')

Step 4: TRACK STATUS
    Admin monitors schedule:
    → Query employee_schedule to see who's confirmed/assigned/declined

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

