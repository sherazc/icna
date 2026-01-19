-- Company operating dates
-- Stores when the company/clinic is scheduled to be open
create table company_operation_date
(
    id                  bigserial    not null primary key,
    company_id          bigint       not null,
    operation_date      date         not null,
    start_time          time,
    end_time            time,
    status              varchar(50)  not null default 'SCHEDULED', -- SCHEDULED, CONFIRMED, CANCELLED, COMPLETED
    notes               text,
    created_at          timestamp    not null default current_timestamp,
    updated_at          timestamp    not null default current_timestamp,
    constraint fk_company_operation_company foreign key (company_id) references company(id),
    constraint uk_company_operation_date unique (company_id, operation_date)
);

-- Employee availability patterns
-- Stores employees' (both providers and volunteers) general availability preferences
create table employee_availability_pattern
(
    id                      bigserial   not null primary key,
    employee_id             bigint      not null,
    availability_pattern    varchar(50) not null,  -- WEEKENDS, SATURDAY, SUNDAY, ANY_DAY, SPECIFIC_DATE
    is_active               boolean     not null default true,
    start_date              date,       -- When this pattern becomes effective
    end_date                date,       -- When this pattern expires (null = indefinite)
    notes                   text,
    created_at              timestamp   not null default current_timestamp,
    constraint fk_employee_avail_pattern_employee foreign key (employee_id) references employee(id)
);

-- Employee specific date availability
-- Stores specific date availability/unavailability for employees (both providers and volunteers)
create table employee_availability_date
(
    id                  bigserial    not null primary key,
    employee_id         bigint       not null,
    availability_date   date         not null,
    is_available        boolean      not null default true,  -- true = available, false = unavailable (exception)
    start_time          time,
    end_time            time,
    notes               text,
    created_at          timestamp    not null default current_timestamp,
    constraint fk_employee_avail_date_employee foreign key (employee_id) references employee(id),
    constraint uk_employee_availability_date unique (employee_id, availability_date)
);

-- Employee schedule
-- Assigns employees (both providers and volunteers) to specific company operation dates
create table employee_schedule
(
    id                      bigserial    not null primary key,
    company_operation_date_id bigint      not null,
    employee_id             bigint       not null,
    assignment_status       varchar(50)  not null default 'ASSIGNED', -- ASSIGNED, CONFIRMED, DECLINED, CANCELLED
    start_time              time,
    end_time                time,
    notes                   text,
    assigned_by             bigint,      -- user_profile_id who made the assignment
    assigned_at             timestamp    not null default current_timestamp,
    confirmed_at            timestamp,
    constraint fk_employee_schedule_operation foreign key (company_operation_date_id) references company_operation_date(id),
    constraint fk_employee_schedule_employee foreign key (employee_id) references employee(id),
    constraint fk_employee_schedule_assigned_by foreign key (assigned_by) references user_profile(id),
    constraint uk_employee_schedule unique (company_operation_date_id, employee_id)
);

-- Sample company operation dates for company 1 (next few weekends)
INSERT INTO company_operation_date (id, company_id, operation_date, start_time, end_time, status, notes)
VALUES
    (1, 1, '2026-01-24', '09:00:00', '17:00:00', 'SCHEDULED', 'Saturday clinic'),
    (2, 1, '2026-01-25', '09:00:00', '17:00:00', 'SCHEDULED', 'Sunday clinic'),
    (3, 1, '2026-01-31', '09:00:00', '17:00:00', 'SCHEDULED', 'Saturday clinic'),
    (4, 1, '2026-02-01', '09:00:00', '17:00:00', 'SCHEDULED', 'Sunday clinic'),
    (5, 1, '2026-02-07', '09:00:00', '17:00:00', 'SCHEDULED', 'Saturday clinic');

SELECT setval(pg_get_serial_sequence('company_operation_date', 'id'), (SELECT MAX(id) FROM company_operation_date));

-- Sample employee availability patterns
-- Employee 1 (John Smith - Provider/General Practitioner) - Available all weekends
INSERT INTO employee_availability_pattern (id, employee_id, availability_pattern, is_active, notes)
VALUES (1, 1, 'WEEKENDS', true, 'Available all weekends');

-- Employee 2 (Sarah Johnson - Provider/Pediatrician) - Available Saturdays only
INSERT INTO employee_availability_pattern (id, employee_id, availability_pattern, is_active, notes)
VALUES (2, 2, 'SATURDAY', true, 'Available Saturdays only');

-- Employee 3 (Michael Williams - Provider/Cardiologist) - Available any day
INSERT INTO employee_availability_pattern (id, employee_id, availability_pattern, is_active, notes)
VALUES (3, 3, 'ANY_DAY', true, 'Available any day');

-- Employee 6 (Jennifer Davis - Volunteer/Nurse) - Available all weekends
INSERT INTO employee_availability_pattern (id, employee_id, availability_pattern, is_active, notes)
VALUES (4, 6, 'WEEKENDS', true, 'Available all weekends');

-- Employee 7 (Robert Miller - Volunteer/Receptionist) - Available Sundays only
INSERT INTO employee_availability_pattern (id, employee_id, availability_pattern, is_active, notes)
VALUES (5, 7, 'SUNDAY', true, 'Available Sundays only');

-- Employee 8 (Jessica Wilson - Volunteer/Medical Assistant) - Available specific dates
INSERT INTO employee_availability_pattern (id, employee_id, availability_pattern, is_active, notes)
VALUES (6, 8, 'SPECIFIC_DATE', true, 'Available on specific dates only');

SELECT setval(pg_get_serial_sequence('employee_availability_pattern', 'id'), (SELECT MAX(id) FROM employee_availability_pattern));

-- Sample specific date availability
-- Employee 3 (Michael Williams - Provider) - Available morning only on Jan 24
INSERT INTO employee_availability_date (id, employee_id, availability_date, is_available, start_time, end_time, notes)
VALUES
    (1, 3, '2026-01-24', true, '09:00:00', '13:00:00', 'Available morning only');

-- Employee 8 (Jessica Wilson - Volunteer) - Available specific dates
INSERT INTO employee_availability_date (id, employee_id, availability_date, is_available, start_time, end_time, notes)
VALUES
    (2, 8, '2026-01-24', true, '09:00:00', '17:00:00', 'Available full day'),
    (3, 8, '2026-01-31', true, '09:00:00', '17:00:00', 'Available full day');

SELECT setval(pg_get_serial_sequence('employee_availability_date', 'id'), (SELECT MAX(id) FROM employee_availability_date));

-- Sample schedule assignments
-- Assign Employee 1 (John Smith - Provider) to first Saturday
INSERT INTO employee_schedule (id, company_operation_date_id, employee_id, assignment_status, start_time, end_time, notes, assigned_by)
VALUES (1, 1, 1, 'CONFIRMED', '09:00:00', '17:00:00', 'Lead provider for the day', 1);

-- Assign Employee 2 (Sarah Johnson - Provider) to first Saturday
INSERT INTO employee_schedule (id, company_operation_date_id, employee_id, assignment_status, start_time, end_time, notes, assigned_by)
VALUES (2, 1, 2, 'CONFIRMED', '09:00:00', '17:00:00', 'Supporting provider', 1);

-- Assign Employee 6 (Jennifer Davis - Volunteer) to first Saturday
INSERT INTO employee_schedule (id, company_operation_date_id, employee_id, assignment_status, start_time, end_time, notes, assigned_by)
VALUES (3, 1, 6, 'CONFIRMED', '09:00:00', '17:00:00', 'Reception duty', 1);

-- Assign Employee 8 (Jessica Wilson - Volunteer) to first Saturday
INSERT INTO employee_schedule (id, company_operation_date_id, employee_id, assignment_status, start_time, end_time, notes, assigned_by)
VALUES (4, 1, 8, 'ASSIGNED', '09:00:00', '17:00:00', 'Medical assistant', 1);

SELECT setval(pg_get_serial_sequence('employee_schedule', 'id'), (SELECT MAX(id) FROM employee_schedule));

-- Create indexes for better query performance
CREATE INDEX idx_company_operation_date_company ON company_operation_date(company_id);
CREATE INDEX idx_company_operation_date_date ON company_operation_date(operation_date);
CREATE INDEX idx_company_operation_date_status ON company_operation_date(status);

CREATE INDEX idx_employee_avail_pattern_employee ON employee_availability_pattern(employee_id);

CREATE INDEX idx_employee_avail_date_employee ON employee_availability_date(employee_id);
CREATE INDEX idx_employee_avail_date_date ON employee_availability_date(availability_date);

CREATE INDEX idx_employee_schedule_operation ON employee_schedule(company_operation_date_id);
CREATE INDEX idx_employee_schedule_employee ON employee_schedule(employee_id);




