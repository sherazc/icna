-- Company operating dates
-- Stores when the company/clinic is scheduled to be open
create table operation_date
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
    constraint fk_operation_date_company foreign key (company_id) references company(id),
    constraint uk_operation_date unique (company_id, operation_date)
);


-- Schedule
-- Assigns employees (both providers and volunteers) to specific operation dates
create table schedule
(
    id                      bigserial    not null primary key,
    operation_date_id       bigint       not null,
    user_profile_id         bigint       not null,
    assignment_status       varchar(50)  not null default 'ASSIGNED', -- ASSIGNED, CONFIRMED, DECLINED, CANCELLED
    start_time              time,
    end_time                time,
    notes                   text,
    assigned_at             timestamp    not null default current_timestamp,
    confirmed_at            timestamp,
    constraint fk_schedule_operation_date foreign key (operation_date_id) references operation_date(id),
    constraint fk_schedule_user_profile foreign key (user_profile_id) references user_profile(id),
    constraint uk_schedule unique (operation_date_id, user_profile_id)
);

-- Sample operation dates for company 1 (next few weekends)
INSERT INTO operation_date (id, company_id, operation_date, start_time, end_time, status, notes)
VALUES
    (1, 1, '2026-01-24', '09:00:00', '17:00:00', 'SCHEDULED', 'Saturday clinic'),
    (2, 1, '2026-01-25', '09:00:00', '17:00:00', 'SCHEDULED', 'Sunday clinic'),
    (3, 1, '2026-01-31', '09:00:00', '17:00:00', 'SCHEDULED', 'Saturday clinic'),
    (4, 1, '2026-02-01', '09:00:00', '17:00:00', 'SCHEDULED', 'Sunday clinic'),
    (5, 1, '2026-02-07', '09:00:00', '17:00:00', 'SCHEDULED', 'Saturday clinic');

SELECT setval(pg_get_serial_sequence('operation_date', 'id'), (SELECT MAX(id) FROM operation_date));


-- Sample schedule assignments
-- Assign user_profile 10 (John Smith - Provider) to first Saturday
INSERT INTO schedule (id, operation_date_id, user_profile_id, assignment_status, start_time, end_time, notes)
VALUES (1, 1, 10, 'CONFIRMED', '09:00:00', '17:00:00', 'Lead provider for the day');

-- Assign user_profile 11 (Sarah Johnson - Provider) to first Saturday
INSERT INTO schedule (id, operation_date_id, user_profile_id, assignment_status, start_time, end_time, notes)
VALUES (2, 1, 11, 'CONFIRMED', '09:00:00', '17:00:00', 'Supporting provider');

-- Assign user_profile 15 (Jennifer Davis - Volunteer) to first Saturday
INSERT INTO schedule (id, operation_date_id, user_profile_id, assignment_status, start_time, end_time, notes)
VALUES (3, 1, 15, 'CONFIRMED', '09:00:00', '17:00:00', 'Reception duty');

-- Assign user_profile 17 (Jessica Wilson - Volunteer) to first Saturday
INSERT INTO schedule (id, operation_date_id, user_profile_id, assignment_status, start_time, end_time, notes)
VALUES (4, 1, 17, 'ASSIGNED', '09:00:00', '17:00:00', 'Medical assistant');

SELECT setval(pg_get_serial_sequence('schedule', 'id'), (SELECT MAX(id) FROM schedule));

-- Create indexes for better query performance
CREATE INDEX idx_operation_date_company ON operation_date(company_id);
CREATE INDEX idx_operation_date_date ON operation_date(operation_date);
CREATE INDEX idx_operation_date_status ON operation_date(status);


CREATE INDEX idx_schedule_operation_date ON schedule(operation_date_id);
CREATE INDEX idx_schedule_user_profile ON schedule(user_profile_id);




