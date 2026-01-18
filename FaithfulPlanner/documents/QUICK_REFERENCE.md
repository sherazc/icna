# Scheduling System - Quick Reference Guide

## 📋 Tables at a Glance

| Table | Purpose |
|-------|---------|
| `clinic_operation_date` | When clinic is open |
| `ref_availability_pattern` | Pattern types (WEEKENDS, SATURDAY, etc.) |
| `provider_availability_pattern` | Provider general availability |
| `worker_availability_pattern` | Worker general availability |
| `provider_date_availability` | Provider specific dates/exceptions |
| `worker_date_availability` | Worker specific dates/exceptions |
| `clinic_schedule_provider` | Provider assignments |
| `clinic_schedule_worker` | Worker assignments |

## 🎯 Common Operations

### 1. Provider declares "I'm available all weekends"
```sql
INSERT INTO provider_availability_pattern (provider_id, availability_pattern_id, is_active)
VALUES (1, 1, true);  -- 1 = WEEKENDS pattern
```

### 2. Worker declares "I'm available Jan 24 and Jan 31"
```sql
-- Set pattern to SPECIFIC_DATE
INSERT INTO worker_availability_pattern (worker_id, availability_pattern_id, is_active)
VALUES (3, 5, true);  -- 5 = SPECIFIC_DATE

-- Add specific dates
INSERT INTO worker_date_availability (worker_id, availability_date, is_available)
VALUES (3, '2026-01-24', true), (3, '2026-01-31', true);
```

### 3. Provider marks exception "Not available Jan 31"
```sql
INSERT INTO provider_date_availability (provider_id, availability_date, is_available)
VALUES (2, '2026-01-31', false);  -- false = unavailable
```

### 4. Create clinic operation date
```sql
INSERT INTO clinic_operation_date (company_id, operation_date, start_time, end_time, status)
VALUES (1, '2026-02-14', '09:00:00', '17:00:00', 'SCHEDULED');
```

### 5. Assign provider to clinic date
```sql
INSERT INTO clinic_schedule_provider 
  (clinic_operation_date_id, provider_id, assignment_status, start_time, end_time, assigned_by)
VALUES (1, 1, 'ASSIGNED', '09:00:00', '17:00:00', 1);
```

### 6. Provider confirms assignment
```sql
UPDATE clinic_schedule_provider
SET assignment_status = 'CONFIRMED', confirmed_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

## 🔍 Common Queries

### Find providers available on specific date
```sql
-- Example: Saturday, Jan 24, 2026
SELECT DISTINCT p.id, p.first_name, p.last_name, p.email
FROM provider p
WHERE p.id IN (
    -- Match by pattern
    SELECT pap.provider_id
    FROM provider_availability_pattern pap
    JOIN ref_availability_pattern rap ON pap.availability_pattern_id = rap.id
    WHERE pap.is_active = true
      AND rap.pattern_code IN ('WEEKENDS', 'SATURDAY', 'ANY_DAY')
    
    UNION
    
    -- Match by specific date
    SELECT provider_id FROM provider_date_availability
    WHERE availability_date = '2026-01-24' AND is_available = true
)
AND p.id NOT IN (
    -- Exclude exceptions
    SELECT provider_id FROM provider_date_availability
    WHERE availability_date = '2026-01-24' AND is_available = false
);
```

### View schedule for a specific date
```sql
SELECT 
    'Provider' as role,
    p.first_name || ' ' || p.last_name as name,
    csp.assignment_status,
    csp.start_time,
    csp.end_time
FROM clinic_schedule_provider csp
JOIN provider p ON csp.provider_id = p.id
JOIN clinic_operation_date cod ON csp.clinic_operation_date_id = cod.id
WHERE cod.operation_date = '2026-01-24' AND cod.company_id = 1

UNION ALL

SELECT 
    'Worker' as role,
    w.first_name || ' ' || w.last_name as name,
    csw.assignment_status,
    csw.start_time,
    csw.end_time
FROM clinic_schedule_worker csw
JOIN worker w ON csw.worker_id = w.id
JOIN clinic_operation_date cod ON csw.clinic_operation_date_id = cod.id
WHERE cod.operation_date = '2026-01-24' AND cod.company_id = 1
ORDER BY role, name;
```

### Find clinic dates needing more staff
```sql
SELECT 
    cod.operation_date,
    COUNT(csp.id) as assigned_providers,
    COUNT(CASE WHEN csp.assignment_status = 'CONFIRMED' THEN 1 END) as confirmed_providers
FROM clinic_operation_date cod
LEFT JOIN clinic_schedule_provider csp ON cod.id = csp.clinic_operation_date_id
WHERE cod.company_id = 1
  AND cod.operation_date >= CURRENT_DATE
  AND cod.status = 'SCHEDULED'
GROUP BY cod.id, cod.operation_date
HAVING COUNT(CASE WHEN csp.assignment_status = 'CONFIRMED' THEN 1 END) < 2
ORDER BY cod.operation_date;
```

## 📊 Status Values

**Assignment Status:**
- `ASSIGNED` - Initial assignment
- `CONFIRMED` - Staff confirmed
- `DECLINED` - Staff declined
- `CANCELLED` - Admin cancelled

**Operation Date Status:**
- `SCHEDULED` - Planned
- `CONFIRMED` - Staff ready
- `CANCELLED` - Clinic cancelled
- `COMPLETED` - Successfully operated

## 🎨 Availability Patterns

| Code | Description |
|------|-------------|
| `WEEKENDS` | All Saturdays and Sundays |
| `SATURDAY` | Saturdays only |
| `SUNDAY` | Sundays only |
| `ANY_DAY` | Any day of week |
| `SPECIFIC_DATE` | Only specified dates |

## 💡 Quick Tips

1. Set `is_active=true` when creating availability patterns
2. Use `is_available=false` for exceptions/unavailability
3. Check BOTH patterns AND specific dates when finding available staff
4. Set `confirmed_at` timestamp when status becomes CONFIRMED
5. Track assignments with `assigned_by` field
6. Use `notes` fields for additional context

## 📝 Typical Workflow

```
1. Provider declares availability
   → provider_availability_pattern

2. Admin creates clinic date
   → clinic_operation_date

3. System finds available staff
   → Query patterns + specific dates

4. Admin assigns staff
   → clinic_schedule_provider/worker (ASSIGNED)

5. Staff confirms
   → UPDATE status to CONFIRMED

6. Clinic operates
   → UPDATE operation_date status to COMPLETED
```

## 📚 Documentation Files

- **SCHEDULING_DESIGN.md** - Full design documentation
- **SCHEDULING_ERD.md** - Visual diagrams
- **IMPLEMENTATION_SUMMARY.md** - What was built
- **QUICK_REFERENCE.md** - This guide

## 🗃️ Migration Files

- `V1_0_0__user_auth.sql` - Base tables
- `V1_0_1__user_auth_data.sql` - Sample users
- `V1_0_2__refrence_type.sql` - Reference types
- `V1_0_3__provider.sql` - Provider tables
- `V1_0_4__worker.sql` - Worker tables
- **`V1_0_5__scheduling.sql`** - Scheduling system ⭐

---

For complete details, see SCHEDULING_DESIGN.md

