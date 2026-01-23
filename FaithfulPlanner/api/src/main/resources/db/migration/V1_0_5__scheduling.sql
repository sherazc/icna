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


-- Employee schedule
-- Assigns employees (both providers and volunteers) to specific company operation dates
create table employee_schedule
(
    id                      bigserial    not null primary key,
    company_operation_date_id bigint      not null,
    user_profile_id         bigint       not null,
    assignment_status       varchar(50)  not null default 'ASSIGNED', -- ASSIGNED, CONFIRMED, DECLINED, CANCELLED
    start_time              time,
    end_time                time,
    notes                   text,
    assigned_at             timestamp    not null default current_timestamp,
    confirmed_at            timestamp,
    constraint fk_employee_schedule_operation foreign key (company_operation_date_id) references company_operation_date(id),
    constraint fk_employee_schedule_user_profile foreign key (user_profile_id) references user_profile(id),
    constraint uk_employee_schedule unique (company_operation_date_id, user_profile_id)
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


-- Sample schedule assignments
-- Assign user_profile 10 (John Smith - Provider) to first Saturday
INSERT INTO employee_schedule (id, company_operation_date_id, user_profile_id, assignment_status, start_time, end_time, notes)
VALUES (1, 1, 10, 'CONFIRMED', '09:00:00', '17:00:00', 'Lead provider for the day');

-- Assign user_profile 11 (Sarah Johnson - Provider) to first Saturday
INSERT INTO employee_schedule (id, company_operation_date_id, user_profile_id, assignment_status, start_time, end_time, notes)
VALUES (2, 1, 11, 'CONFIRMED', '09:00:00', '17:00:00', 'Supporting provider');

-- Assign user_profile 15 (Jennifer Davis - Volunteer) to first Saturday
INSERT INTO employee_schedule (id, company_operation_date_id, user_profile_id, assignment_status, start_time, end_time, notes)
VALUES (3, 1, 15, 'CONFIRMED', '09:00:00', '17:00:00', 'Reception duty');

-- Assign user_profile 17 (Jessica Wilson - Volunteer) to first Saturday
INSERT INTO employee_schedule (id, company_operation_date_id, user_profile_id, assignment_status, start_time, end_time, notes)
VALUES (4, 1, 17, 'ASSIGNED', '09:00:00', '17:00:00', 'Medical assistant');

SELECT setval(pg_get_serial_sequence('employee_schedule', 'id'), (SELECT MAX(id) FROM employee_schedule));

-- Create indexes for better query performance
CREATE INDEX idx_company_operation_date_company ON company_operation_date(company_id);
CREATE INDEX idx_company_operation_date_date ON company_operation_date(operation_date);
CREATE INDEX idx_company_operation_date_status ON company_operation_date(status);


CREATE INDEX idx_employee_schedule_operation ON employee_schedule(company_operation_date_id);
CREATE INDEX idx_employee_schedule_user_profile ON employee_schedule(user_profile_id);




