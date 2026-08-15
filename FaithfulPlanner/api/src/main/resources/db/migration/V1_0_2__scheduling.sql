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

-- Create indexes for better query performance
CREATE INDEX idx_operation_day_company ON operation_day(company_id);
CREATE INDEX idx_operation_day_service_date ON operation_day(service_date);

CREATE INDEX idx_schedule_operation_day ON schedule(operation_day_id);
CREATE INDEX idx_schedule_user_profile ON schedule(user_profile_id);