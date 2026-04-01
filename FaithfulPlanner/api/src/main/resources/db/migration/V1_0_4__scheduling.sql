-- Company operating dates
create table operation_day
(
    id                  bigserial    not null primary key,
    company_id          bigint       not null,
    service_date        date         not null,
    notes               text,
    constraint fk_operation_day_company foreign key (company_id) references company(id),
    constraint uk_operation_day unique (company_id, service_date)
);

-- Schedule
create table schedule
(
    id                      bigserial    not null primary key,
    operation_day_id       bigint       not null,
    user_profile_id         bigint       not null,
    constraint fk_schedule_operation_day foreign key (operation_day_id) references operation_day(id),
    constraint fk_schedule_user_profile foreign key (user_profile_id) references user_profile(id),
    constraint uk_schedule unique (operation_day_id, user_profile_id)
);

-- Sample operation dates for company 1 (next few weekends)
INSERT INTO operation_day (id, company_id, service_date, notes)
VALUES
    (1, 1, '2026-01-24', 'Saturday clinic'),
    (2, 1, '2026-01-25', 'Sunday clinic'),
    (3, 1, '2026-01-31', 'Saturday clinic'),
    (4, 1, '2026-02-01', 'Sunday clinic'),
    (5, 1, '2026-02-07', 'Saturday clinic');

SELECT setval(pg_get_serial_sequence('operation_day', 'id'), (SELECT MAX(id) FROM operation_day));

-- Sample schedule assignments
-- Assign user_profile 10 (John Smith - Provider) to first Saturday
INSERT INTO schedule (id, operation_day_id, user_profile_id)
VALUES (1, 1, 10);

-- Assign user_profile 11 (Sarah Johnson - Provider) to first Saturday
INSERT INTO schedule (id, operation_day_id, user_profile_id)
VALUES (2, 1, 11);

-- Assign user_profile 15 (Jennifer Davis - Volunteer) to first Saturday
INSERT INTO schedule (id, operation_day_id, user_profile_id)
VALUES (3, 1, 15);

-- Assign user_profile 17 (Jessica Wilson - Volunteer) to first Saturday
INSERT INTO schedule (id, operation_day_id, user_profile_id)
VALUES (4, 1, 17);

SELECT setval(pg_get_serial_sequence('schedule', 'id'), (SELECT MAX(id) FROM schedule));

-- Create indexes for better query performance
CREATE INDEX idx_operation_day_company ON operation_day(company_id);
CREATE INDEX idx_operation_day_service_date ON operation_day(service_date);

CREATE INDEX idx_schedule_operation_day ON schedule(operation_day_id);
CREATE INDEX idx_schedule_user_profile ON schedule(user_profile_id);