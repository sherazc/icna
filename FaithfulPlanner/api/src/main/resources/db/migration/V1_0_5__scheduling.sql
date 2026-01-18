-- Clinic operating dates
-- Stores when the clinic is scheduled to be open
create table clinic_operation_date
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
    constraint fk_clinic_operation_company foreign key (company_id) references company(id),
    constraint uk_clinic_operation_date unique (company_id, operation_date)
);

-- Provider availability patterns
-- Stores providers' general availability preferences
create table provider_availability_pattern
(
    id                      bigserial   not null primary key,
    provider_id             bigint      not null,
    availability_pattern    varchar(50) not null,  -- WEEKENDS, SATURDAY, SUNDAY, ANY_DAY, SPECIFIC_DATE
    is_active               boolean     not null default true,
    start_date              date,       -- When this pattern becomes effective
    end_date                date,       -- When this pattern expires (null = indefinite)
    notes                   text,
    created_at              timestamp   not null default current_timestamp,
    constraint fk_provider_avail_pattern_provider foreign key (provider_id) references provider(id)
);

-- Worker availability patterns
-- Stores workers' general availability preferences
create table worker_availability_pattern
(
    id                      bigserial   not null primary key,
    worker_id               bigint      not null,
    availability_pattern    varchar(50) not null,  -- WEEKENDS, SATURDAY, SUNDAY, ANY_DAY, SPECIFIC_DATE
    is_active               boolean     not null default true,
    start_date              date,       -- When this pattern becomes effective
    end_date                date,       -- When this pattern expires (null = indefinite)
    notes                   text,
    created_at              timestamp   not null default current_timestamp,
    constraint fk_worker_avail_pattern_worker foreign key (worker_id) references worker(id)
);

-- Provider specific date availability
-- Stores specific date availability/unavailability for providers
create table provider_availability_date
(
    id                  bigserial    not null primary key,
    provider_id         bigint       not null,
    availability_date   date         not null,
    is_available        boolean      not null default true,  -- true = available, false = unavailable (exception)
    start_time          time,
    end_time            time,
    notes               text,
    created_at          timestamp    not null default current_timestamp,
    constraint fk_provider_avail_date_provider foreign key (provider_id) references provider(id),
    constraint uk_provider_availability_date unique (provider_id, availability_date)
);

-- Worker specific date availability
-- Stores specific date availability/unavailability for workers
create table worker_availability_date
(
    id                  bigserial    not null primary key,
    worker_id           bigint       not null,
    availability_date   date         not null,
    is_available        boolean      not null default true,  -- true = available, false = unavailable (exception)
    start_time          time,
    end_time            time,
    notes               text,
    created_at          timestamp    not null default current_timestamp,
    constraint fk_worker_avail_date_worker foreign key (worker_id) references worker(id),
    constraint uk_worker_availability_date unique (worker_id, availability_date)
);

-- Clinic schedule - Provider assignments
-- Assigns providers to specific clinic operation dates
create table clinic_schedule_provider
(
    id                      bigserial    not null primary key,
    clinic_operation_date_id bigint      not null,
    provider_id             bigint       not null,
    assignment_status       varchar(50)  not null default 'ASSIGNED', -- ASSIGNED, CONFIRMED, DECLINED, CANCELLED
    start_time              time,
    end_time                time,
    notes                   text,
    assigned_by             bigint,      -- user_profile_id who made the assignment
    assigned_at             timestamp    not null default current_timestamp,
    confirmed_at            timestamp,
    constraint fk_schedule_provider_operation foreign key (clinic_operation_date_id) references clinic_operation_date(id),
    constraint fk_schedule_provider_provider foreign key (provider_id) references provider(id),
    constraint fk_schedule_provider_assigned_by foreign key (assigned_by) references user_profile(id),
    constraint uk_schedule_provider unique (clinic_operation_date_id, provider_id)
);

-- Clinic schedule - Worker assignments
-- Assigns workers to specific clinic operation dates
create table clinic_schedule_worker
(
    id                      bigserial    not null primary key,
    clinic_operation_date_id bigint      not null,
    worker_id               bigint       not null,
    assignment_status       varchar(50)  not null default 'ASSIGNED', -- ASSIGNED, CONFIRMED, DECLINED, CANCELLED
    start_time              time,
    end_time                time,
    notes                   text,
    assigned_by             bigint,      -- user_profile_id who made the assignment
    assigned_at             timestamp    not null default current_timestamp,
    confirmed_at            timestamp,
    constraint fk_schedule_worker_operation foreign key (clinic_operation_date_id) references clinic_operation_date(id),
    constraint fk_schedule_worker_worker foreign key (worker_id) references worker(id),
    constraint fk_schedule_worker_assigned_by foreign key (assigned_by) references user_profile(id),
    constraint uk_schedule_worker unique (clinic_operation_date_id, worker_id)
);

-- Sample clinic operation dates for company 1 (next few weekends)
INSERT INTO clinic_operation_date (id, company_id, operation_date, start_time, end_time, status, notes)
VALUES
    (1, 1, '2026-01-24', '09:00:00', '17:00:00', 'SCHEDULED', 'Saturday clinic'),
    (2, 1, '2026-01-25', '09:00:00', '17:00:00', 'SCHEDULED', 'Sunday clinic'),
    (3, 1, '2026-01-31', '09:00:00', '17:00:00', 'SCHEDULED', 'Saturday clinic'),
    (4, 1, '2026-02-01', '09:00:00', '17:00:00', 'SCHEDULED', 'Sunday clinic'),
    (5, 1, '2026-02-07', '09:00:00', '17:00:00', 'SCHEDULED', 'Saturday clinic');

SELECT setval(pg_get_serial_sequence('clinic_operation_date', 'id'), (SELECT MAX(id) FROM clinic_operation_date));

-- Sample provider availability patterns
-- Provider 1 (John Smith) - Available all weekends
INSERT INTO provider_availability_pattern (id, provider_id, availability_pattern, is_active, notes)
VALUES (1, 1, 'WEEKENDS', true, 'Available all weekends');

-- Provider 2 (Sarah Johnson) - Available Saturdays only
INSERT INTO provider_availability_pattern (id, provider_id, availability_pattern, is_active, notes)
VALUES (2, 2, 'SATURDAY', true, 'Available Saturdays only');

-- Provider 3 (Michael Williams) - Available any day
INSERT INTO provider_availability_pattern (id, provider_id, availability_pattern, is_active, notes)
VALUES (3, 3, 'ANY_DAY', true, 'Available any day');

SELECT setval(pg_get_serial_sequence('provider_availability_pattern', 'id'), (SELECT MAX(id) FROM provider_availability_pattern));

-- Sample worker availability patterns
-- Worker 1 (Jennifer Davis) - Available all weekends
INSERT INTO worker_availability_pattern (id, worker_id, availability_pattern, is_active, notes)
VALUES (1, 1, 'WEEKENDS', true, 'Available all weekends');

-- Worker 2 (Robert Miller) - Available Sundays only
INSERT INTO worker_availability_pattern (id, worker_id, availability_pattern, is_active, notes)
VALUES (2, 2, 'SUNDAY', true, 'Available Sundays only');

-- Worker 3 (Jessica Wilson) - Available specific dates
INSERT INTO worker_availability_pattern (id, worker_id, availability_pattern, is_active, notes)
VALUES (3, 3, 'SPECIFIC_DATE', true, 'Available on specific dates only');

SELECT setval(pg_get_serial_sequence('worker_availability_pattern', 'id'), (SELECT MAX(id) FROM worker_availability_pattern));

-- Sample specific date availability for Provider 3
INSERT INTO provider_availability_date (id, provider_id, availability_date, is_available, start_time, end_time, notes)
VALUES
    (1, 3, '2026-01-24', true, '09:00:00', '13:00:00', 'Available morning only');

SELECT setval(pg_get_serial_sequence('provider_availability_date', 'id'), (SELECT MAX(id) FROM provider_availability_date));

INSERT INTO worker_availability_date (id, worker_id, availability_date, is_available, start_time, end_time, notes)
VALUES
    (1, 3, '2026-01-24', true, '09:00:00', '17:00:00', 'Available full day'),
    (2, 3, '2026-01-31', true, '09:00:00', '17:00:00', 'Available full day');

SELECT setval(pg_get_serial_sequence('worker_availability_date', 'id'), (SELECT MAX(id) FROM worker_availability_date));

-- Sample schedule assignments
-- Assign Provider 1 to first Saturday
INSERT INTO clinic_schedule_provider (id, clinic_operation_date_id, provider_id, assignment_status, start_time, end_time, notes, assigned_by)
VALUES (1, 1, 1, 'CONFIRMED', '09:00:00', '17:00:00', 'Lead provider for the day', 1);

-- Assign Provider 2 to first Saturday
INSERT INTO clinic_schedule_provider (id, clinic_operation_date_id, provider_id, assignment_status, start_time, end_time, notes, assigned_by)
VALUES (2, 1, 2, 'CONFIRMED', '09:00:00', '17:00:00', 'Supporting provider', 1);

SELECT setval(pg_get_serial_sequence('clinic_schedule_provider', 'id'), (SELECT MAX(id) FROM clinic_schedule_provider));

-- Assign Worker 1 to first Saturday
INSERT INTO clinic_schedule_worker (id, clinic_operation_date_id, worker_id, assignment_status, start_time, end_time, notes, assigned_by)
VALUES (1, 1, 1, 'CONFIRMED', '09:00:00', '17:00:00', 'Reception duty', 1);

-- Assign Worker 3 to first Saturday
INSERT INTO clinic_schedule_worker (id, clinic_operation_date_id, worker_id, assignment_status, start_time, end_time, notes, assigned_by)
VALUES (2, 1, 3, 'ASSIGNED', '09:00:00', '17:00:00', 'Medical assistant', 1);

SELECT setval(pg_get_serial_sequence('clinic_schedule_worker', 'id'), (SELECT MAX(id) FROM clinic_schedule_worker));

-- Create indexes for better query performance
CREATE INDEX idx_clinic_operation_date_company ON clinic_operation_date(company_id);
CREATE INDEX idx_clinic_operation_date_date ON clinic_operation_date(operation_date);
CREATE INDEX idx_clinic_operation_date_status ON clinic_operation_date(status);

CREATE INDEX idx_provider_avail_pattern_provider ON provider_availability_pattern(provider_id);
CREATE INDEX idx_worker_avail_pattern_worker ON worker_availability_pattern(worker_id);

CREATE INDEX idx_provider_avail_date_provider ON provider_availability_date(provider_id);
CREATE INDEX idx_provider_avail_date_date ON provider_availability_date(availability_date);

CREATE INDEX idx_worker_avail_date_worker ON worker_availability_date(worker_id);
CREATE INDEX idx_worker_avail_date_date ON worker_availability_date(availability_date);

CREATE INDEX idx_schedule_provider_operation ON clinic_schedule_provider(clinic_operation_date_id);
CREATE INDEX idx_schedule_provider_provider ON clinic_schedule_provider(provider_id);

CREATE INDEX idx_schedule_worker_operation ON clinic_schedule_worker(clinic_operation_date_id);
CREATE INDEX idx_schedule_worker_worker ON clinic_schedule_worker(worker_id);


