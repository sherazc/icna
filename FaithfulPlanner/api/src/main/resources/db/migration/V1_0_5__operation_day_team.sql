create table if not exists team
(
    id               bigserial    not null primary key,
    operation_day_id bigint       not null,
    team_name        varchar(255) not null,
    constraint fk_team_operation_day foreign key (operation_day_id) references operation_day (id)
);

create index if not exists idx_team_operation_day on team (operation_day_id);

create table if not exists m2m_team_employee_type
(
    team_id          bigint not null,
    employee_type_id bigint not null,
    primary key (team_id, employee_type_id),
    constraint fk_m2m_team_employee_type_team foreign key (team_id) references team (id),
    constraint fk_m2m_team_employee_type_employee_type foreign key (employee_type_id) references employee_type (id)
);

create index if not exists idx_m2m_team_employee_type_team on m2m_team_employee_type (team_id);
create index if not exists idx_m2m_team_employee_type_employee_type on m2m_team_employee_type (employee_type_id);
