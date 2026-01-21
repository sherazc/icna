# Clinic Scheduling System - Database Design

## Overview
This document explains the database design for the clinic scheduling system that manages employee (providers and volunteers) scheduling for companies/clinics that operate on flexible schedules.

## Key Concepts

### Terminology
- **Company** = Clinic/Organization
- **Employee** = Can be either Provider (doctor) or Volunteer (staff)
- **Provider** = Medical providers (doctors, physicians) - identified by EmployeeTypeGroup.PROVIDER
- **Volunteer** = Support staff (nurses, receptionists, etc.) - identified by EmployeeTypeGroup.VOLUNTEER
- **User Profile** = System User

## Database Tables

### 1. Company Operation Dates (`company_operation_date`)
Stores when the company/clinic is scheduled to be open.

**Key Fields:**
- `operation_date`: The date the company is open
- `start_time` / `end_time`: Operating hours for that day
- `status`: SCHEDULED, CONFIRMED, CANCELLED, COMPLETED (CompanyOperationStatus enum)
- `company_id`: Links to the company

**Purpose:** Defines all dates when the company plans to operate, regardless of regular schedule.

---

### 2. Employee Schedule (`employee_schedule`)

Assigns employees (both providers and volunteers) to specific company operation dates.

**Key Fields:**
- `company_operation_date_id`: The operation date
- `employee_id`: The assigned employee
- `assignment_status`: ASSIGNED, CONFIRMED, DECLINED, CANCELLED
- `start_time` / `end_time`: Shift hours
- `assigned_by`: User who made the assignment
- `assigned_at` / `confirmed_at`: Timestamps
- `assignment_status`: ASSIGNED, CONFIRMED, DECLINED, CANCELLED
- `start_time` / `end_time`: Shift hours
- `assigned_by`: User who made the assignment
- `assigned_at` / `confirmed_at`: Timestamps

**Purpose:** Final schedule - who is actually scheduled to work on which dates.

**Workflow:**
1. Admin creates company operation date (Jan 24)
2. Admin assigns employees to the schedule
3. Assigned employees can confirm or decline
4. Status tracks the assignment lifecycle

---

## How It Works - Simplified Flow

### Step 1: Company Creates Operation Dates

Admin creates company operation dates:
```
Jan 24 (Saturday) 9am-5pm - SCHEDULED
Jan 25 (Sunday) 9am-5pm - SCHEDULED
Jan 31 (Saturday) 9am-5pm - SCHEDULED
```

### Step 2: Admin Assigns Employees

Admin directly assigns employees to operation dates:
```
Jan 24 schedule:
- Employee 1 (Dr. Smith - Provider): 9am-5pm (ASSIGNED)
- Employee 2 (Dr. Johnson - Provider): 9am-5pm (ASSIGNED)
- Employee 6 (Jennifer Davis - Volunteer): 9am-5pm (ASSIGNED)
- Employee 8 (Jessica Wilson - Volunteer): 9am-5pm (ASSIGNED)
```

### Step 3: Tracking and Confirmation

- Assigned employees receive notifications
- They can confirm or decline
- Status updates from ASSIGNED → CONFIRMED or DECLINED
- Admin can see who's confirmed and fill gaps

---

## Key Features

### Simplicity
- Direct assignment model - no complex availability tracking
- Admin assigns employees based on their own knowledge
- Flexible scheduling without predefined patterns

### Efficiency
- Simple two-table structure (company_operation_date + employee_schedule)
- Easy to understand and maintain
- Quick assignments without availability checks

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
SELECT DISTINCT p.* FROM provider p
WHERE p.id IN (
    -- Match by pattern (no JOIN needed with enum!)
    SELECT pap.provider_id
    FROM provider_availability_pattern pap
    WHERE pap.is_active = true
      AND (pap.start_date IS NULL OR pap.start_date <= '2026-01-24')
      AND (pap.end_date IS NULL OR pap.end_date >= '2026-01-24')
      AND pap.availability_pattern IN ('WEEKENDS', 'SATURDAY', 'ANY_DAY')
      AND pap.provider_id NOT IN (
        -- Exclude those with unavailability exception for this date
        SELECT provider_id FROM provider_availability_date
        WHERE availability_date = '2026-01-24' AND is_available = false
      )
    
    UNION
    
    -- Providers with specific date availability for this date

### Find all scheduled employees for a company operation date:

```sql
SELECT e.*, et.type_name, et.employee_type_group, 
       es.assignment_status, es.start_time, es.end_time
FROM employee_schedule es
JOIN employee e ON es.employee_id = e.id
JOIN m2m_employee_employee_type meet ON e.id = meet.employee_id
JOIN employee_type et ON meet.employee_type_id = et.id
JOIN company_operation_date cod ON es.company_operation_date_id = cod.id
WHERE cod.operation_date = '2026-01-24'
  AND cod.company_id = 1
ORDER BY et.employee_type_group, es.assignment_status, e.last_name;
```

### Find upcoming company operation dates with assignment counts:

```sql
SELECT cod.*, 
       COUNT(DISTINCT es.id) as assigned_employees,
       COUNT(DISTINCT CASE WHEN es.assignment_status = 'CONFIRMED' THEN es.id END) as confirmed_employees,
       COUNT(DISTINCT CASE WHEN et.employee_type_group = 'PROVIDER' THEN es.id END) as assigned_providers,
       COUNT(DISTINCT CASE WHEN et.employee_type_group = 'VOLUNTEER' THEN es.id END) as assigned_volunteers
FROM company_operation_date cod
LEFT JOIN employee_schedule es ON cod.id = es.company_operation_date_id
LEFT JOIN employee e ON es.employee_id = e.id
LEFT JOIN m2m_employee_employee_type meet ON e.id = meet.employee_id
LEFT JOIN employee_type et ON meet.employee_type_id = et.id
WHERE cod.company_id = 1
  AND cod.operation_date >= CURRENT_DATE
  AND cod.status = 'SCHEDULED'
GROUP BY cod.id
ORDER BY cod.operation_date;
```

### Find all employees:

```sql
SELECT e.*, et.type_name, et.employee_type_group
FROM employee e
JOIN m2m_employee_employee_type meet ON e.id = meet.employee_id
JOIN employee_type et ON meet.employee_type_id = et.id
WHERE e.company_id = 1
ORDER BY et.employee_type_group, e.last_name;
```

---

## Sample Data Included

The migration includes sample data:

**Company Operation Dates:**
- 5 upcoming dates for company 1 (weekends in late Jan/early Feb 2026)

**Employees (Providers):**
- Employee 1: John Smith (General Practitioner)
- Employee 2: Sarah Johnson (Pediatrician)
- Employee 3: Michael Williams (Cardiologist)
- Employee 4: Emily Brown (Dermatologist)
- Employee 5: David Jones (Orthopedic Surgeon + General Practitioner)

**Employees (Volunteers):**
- Employee 6: Jennifer Davis (Nurse + Medical Assistant)
- Employee 7: Robert Miller (Receptionist)
- Employee 8: Jessica Wilson (Medical Assistant)
- Employee 9-13: Other volunteer staff

**Sample Assignments:**
- Jan 24 has 2 providers and 2 volunteers assigned

---

## Future Enhancements (Ideas)

1. **Shift Templates**: Predefined shift types (morning/afternoon/full-day)
2. **Required Roles**: Specify minimum providers/employees needed per date
3. **Notification System**: Auto-notify employees when assigned
4. **Recurring Operation Dates**: Bulk create multiple weekends at once
5. **Employee Requests**: Employees request to be scheduled vs. admin assignment only
6. **Time-off Management**: Track employee time-off to prevent scheduling conflicts
7. **Skills/Certifications**: Match employee skills to operation needs
8. **Conflict Detection**: Prevent double-booking across multiple companies
9. **Employee Availability**: Optional feature to track when employees are available
10. **Calendar Integration**: Sync with external calendars

---

## Database Design Principles

1. **Simplicity First**: Direct assignment model without complex availability tracking
2. **Flexibility**: Support any operation date without predefined schedules
3. **Audit Trail**: Track who, when, and why for assignments
4. **Performance**: Indexes on common query patterns
5. **Data Integrity**: Foreign keys and unique constraints
6. **Extensibility**: Easy to add new features as needed

---

## Notes

- All times are stored without timezone (assumes single timezone per company)
- Dates are stored as DATE type (no time component)
- Times stored as TIME type (for shift hours)
- Timestamps use TIMESTAMP type for audit fields
- Created dates default to current_timestamp
- Employee types support multiple types per employee (many-to-many)
- Employees are unified - providers and volunteers use the same table
