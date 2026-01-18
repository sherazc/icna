# Clinic Scheduling System - Database Design

## Overview
This document explains the database design for the clinic scheduling system that manages provider (doctor) and worker (volunteer) scheduling for clinics that operate on irregular schedules.

## Key Concepts

### Terminology
- **Company** = Clinic
- **Provider** = Doctor
- **Worker** = Volunteer
- **User Profile** = System User

## Database Tables

### 1. Clinic Operation Dates (`clinic_operation_date`)
Stores when the clinic is scheduled to be open.

**Key Fields:**
- `operation_date`: The date the clinic is open
- `start_time` / `end_time`: Operating hours for that day
- `status`: SCHEDULED, CONFIRMED, CANCELLED, COMPLETED
- `company_id`: Links to the clinic

**Purpose:** Defines all dates when the clinic plans to operate, regardless of regular schedule.

---

### 2. Availability Patterns (`ref_availability_pattern`)
Reference table for recurring availability patterns.

**Predefined Patterns:**
- `WEEKENDS`: Available on all Saturdays and Sundays
- `SATURDAY`: Available on Saturdays only
- `SUNDAY`: Available on Sundays only
- `ANY_DAY`: Available on any day of the week
- `SPECIFIC_DATE`: Available on specific dates only

**Purpose:** Standardizes common availability patterns for easy selection.

---

### 3. Provider/Worker Availability Patterns
(`provider_availability_pattern`, `worker_availability_pattern`)

Stores general availability preferences for providers and workers.

**Key Fields:**
- `provider_id` / `worker_id`: Links to the person
- `availability_pattern_id`: Links to the pattern (e.g., WEEKENDS)
- `is_active`: Whether this pattern is currently active
- `start_date` / `end_date`: When this pattern is effective (null end_date = indefinite)

**Purpose:** Allows providers/workers to declare their general availability (e.g., "I'm available all weekends").

**Examples:**
- Dr. Smith says: "I'm available all weekends" → Uses WEEKENDS pattern
- Nurse Johnson says: "I'm available Saturdays only" → Uses SATURDAY pattern

---

### 4. Specific Date Availability
(`provider_date_availability`, `worker_date_availability`)

Stores specific date availability or unavailability overrides.

**Key Fields:**
- `availability_date`: The specific date
- `is_available`: true = available, false = unavailable (exception)
- `start_time` / `end_time`: Available hours for that date
- `notes`: Additional information

**Purpose:** 
- Allows declaring availability for specific dates not covered by patterns
- Allows marking unavailability exceptions (e.g., "I'm usually available weekends, but not Jan 24")

**Examples:**
- Dr. Williams has pattern "ANY_DAY" but adds specific date: "Jan 24, 9am-1pm only"
- Volunteer Davis has pattern "WEEKENDS" but adds exception: "Jan 24 - unavailable (vacation)"

---

### 5. Clinic Schedule Assignments
(`clinic_schedule_provider`, `clinic_schedule_worker`)

Assigns providers/workers to specific clinic operation dates.

**Key Fields:**
- `clinic_operation_date_id`: The clinic date
- `provider_id` / `worker_id`: The assigned person
- `assignment_status`: ASSIGNED, CONFIRMED, DECLINED, CANCELLED
- `start_time` / `end_time`: Shift hours
- `assigned_by`: User who made the assignment
- `assigned_at` / `confirmed_at`: Timestamps

**Purpose:** Final schedule - who is actually scheduled to work on which dates.

**Workflow:**
1. Admin creates clinic operation date (Jan 24)
2. System checks who is available on Jan 24 (based on patterns + specific dates)
3. Admin assigns available people to the schedule
4. Assigned people can confirm or decline
5. Status tracks the assignment lifecycle

---

## How It Works - Complete Flow

### Step 1: Providers/Workers Declare Availability

**Option A - Use a Pattern:**
```
Dr. Smith: "I'm available all weekends"
→ Creates provider_availability_pattern with WEEKENDS pattern
```

**Option B - Specify Dates:**
```
Volunteer Wilson: "I'm only available on Jan 24 and Jan 31"
→ Creates worker_availability_pattern with SPECIFIC_DATE pattern
→ Creates worker_date_availability entries for Jan 24 and Jan 31
```

**Option C - Pattern + Exceptions:**
```
Dr. Johnson: "I'm available Saturdays, but not on Jan 31 (vacation)"
→ Creates provider_availability_pattern with SATURDAY pattern
→ Creates provider_date_availability for Jan 31 with is_available=false
```

### Step 2: Clinic Creates Operation Dates

Admin creates clinic operation dates:
```
Jan 24 (Saturday) 9am-5pm - SCHEDULED
Jan 25 (Sunday) 9am-5pm - SCHEDULED
Jan 31 (Saturday) 9am-5pm - SCHEDULED
```

### Step 3: System Determines Availability

For each operation date, the system checks:
1. Who has matching availability patterns?
2. Who has specific date availability entries?
3. Who has unavailability exceptions?

**Example for Jan 24 (Saturday):**
- ✅ Dr. Smith (pattern: WEEKENDS)
- ✅ Dr. Johnson (pattern: SATURDAY)
- ✅ Dr. Williams (specific date: Jan 24)
- ✅ Volunteer Davis (pattern: WEEKENDS)
- ❌ Volunteer Miller (pattern: SUNDAY only)
- ✅ Volunteer Wilson (specific date: Jan 24)

### Step 4: Admin Makes Assignments

Based on available people, admin assigns:
```
Jan 24 schedule:
- Dr. Smith: 9am-5pm (ASSIGNED → CONFIRMED)
- Dr. Johnson: 9am-5pm (ASSIGNED → CONFIRMED)
- Volunteer Davis: 9am-5pm (ASSIGNED → CONFIRMED)
- Volunteer Wilson: 9am-5pm (ASSIGNED → pending confirmation)
```

### Step 5: Tracking and Confirmation

- Assigned people receive notifications
- They can confirm or decline
- Status updates from ASSIGNED → CONFIRMED or DECLINED
- Admin can see who's confirmed and fill gaps

---

## Key Features

### Flexibility
- No fixed schedule - clinic can operate any day
- Providers/workers can express availability in multiple ways
- Can handle one-time dates, recurring patterns, and exceptions

### Efficiency
- Patterns reduce data entry (one "WEEKENDS" pattern vs. entering every Saturday and Sunday)
- Specific dates allow overrides without changing patterns
- Easy to find available people for any given date

### Tracking
- Assignment status tracks the full lifecycle
- Timestamps show when assignments were made and confirmed
- Notes field for additional context
- Audit trail of who made assignments

### Data Integrity
- Foreign keys ensure referential integrity
- Unique constraints prevent duplicate assignments
- Indexes optimize query performance

---

## Query Examples

### Find all providers available on a specific date (e.g., Jan 24, 2026 - Saturday):

```sql
-- Providers with WEEKENDS or SATURDAY pattern (and date is in effective range)
SELECT p.* FROM provider p
JOIN provider_availability_pattern pap ON p.id = pap.provider_id
JOIN ref_availability_pattern rap ON pap.availability_pattern_id = rap.id
WHERE pap.is_active = true
  AND (pap.start_date IS NULL OR pap.start_date <= '2026-01-24')
  AND (pap.end_date IS NULL OR pap.end_date >= '2026-01-24')
  AND rap.pattern_code IN ('WEEKENDS', 'SATURDAY', 'ANY_DAY')
  AND p.id NOT IN (
    -- Exclude those with unavailability exception for this date
    SELECT provider_id FROM provider_date_availability
    WHERE availability_date = '2026-01-24' AND is_available = false
  )

UNION

-- Providers with specific date availability for this date
SELECT p.* FROM provider p
JOIN provider_date_availability pda ON p.id = pda.provider_id
WHERE pda.availability_date = '2026-01-24'
  AND pda.is_available = true;
```

### Find all scheduled providers for a clinic operation date:

```sql
SELECT p.*, csp.assignment_status, csp.start_time, csp.end_time
FROM clinic_schedule_provider csp
JOIN provider p ON csp.provider_id = p.id
JOIN clinic_operation_date cod ON csp.clinic_operation_date_id = cod.id
WHERE cod.operation_date = '2026-01-24'
  AND cod.company_id = 1
ORDER BY csp.assignment_status, p.last_name;
```

### Find upcoming clinic dates that need providers:

```sql
SELECT cod.*, 
       COUNT(csp.id) as assigned_providers,
       COUNT(CASE WHEN csp.assignment_status = 'CONFIRMED' THEN 1 END) as confirmed_providers
FROM clinic_operation_date cod
LEFT JOIN clinic_schedule_provider csp ON cod.id = csp.clinic_operation_date_id
WHERE cod.company_id = 1
  AND cod.operation_date >= CURRENT_DATE
  AND cod.status = 'SCHEDULED'
GROUP BY cod.id
HAVING COUNT(CASE WHEN csp.assignment_status = 'CONFIRMED' THEN 1 END) < 2  -- Need at least 2 confirmed
ORDER BY cod.operation_date;
```

---

## Sample Data Included

The migration includes sample data:

**Clinic Operation Dates:**
- 5 upcoming dates for company/clinic 1 (weekends in late Jan/early Feb 2026)

**Provider Availability:**
- Dr. John Smith: Available all weekends
- Dr. Sarah Johnson: Available Saturdays only
- Dr. Michael Williams: Available any day (with specific morning-only availability on Jan 24)

**Worker Availability:**
- Jennifer Davis (Nurse): Available all weekends
- Robert Miller (Receptionist): Available Sundays only
- Jessica Wilson (Medical Assistant): Specific dates only (Jan 24, Jan 31)

**Sample Assignments:**
- Jan 24 has 2 providers and 2 workers assigned

---

## Future Enhancements (Ideas)

1. **Shift Templates**: Predefined shift types (morning/afternoon/full-day)
2. **Required Roles**: Specify minimum providers/workers needed per date
3. **Notification System**: Auto-notify available people when new dates are created
4. **Recurring Operation Dates**: Bulk create multiple weekends at once
5. **Availability Requests**: Workers request to be scheduled vs. admin assignment
6. **Time-off Requests**: Formal unavailability request/approval workflow
7. **Skills/Certifications**: Match provider skills to clinic needs
8. **Conflict Detection**: Prevent double-booking across multiple clinics

---

## Database Design Principles

1. **Separation of Concerns**: Availability (what's possible) vs. Schedule (what's actual)
2. **Flexibility First**: Support multiple ways of expressing availability
3. **Audit Trail**: Track who, when, and why for assignments
4. **Performance**: Indexes on common query patterns
5. **Data Integrity**: Foreign keys and unique constraints
6. **Extensibility**: Easy to add new patterns or statuses

---

## Notes

- All times are stored without timezone (assumes single timezone per clinic)
- Dates are stored as DATE type (no time component)
- Times stored as TIME type (for shift hours)
- Timestamps use TIMESTAMP type for audit fields
- Created dates default to current_timestamp
- Sample data uses realistic scenarios with different availability patterns

