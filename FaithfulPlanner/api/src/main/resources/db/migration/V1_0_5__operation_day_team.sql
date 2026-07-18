create table if not exists team
(
    id         bigserial    not null primary key,
    company_id bigint       not null,
    team_name  varchar(255) not null,
    constraint fk_team_company foreign key (company_id) references company (id),
    constraint uk_team_company_name unique (company_id, team_name)
);

create index if not exists idx_team_company on team (company_id);

create table if not exists team_employee_type
(
    id                bigserial not null primary key,
    team_id           bigint    not null,
    employee_type_id  bigint    not null,
    required_count    int       not null default 1,
    constraint fk_team_employee_type_team foreign key (team_id) references team (id),
    constraint fk_team_employee_type_employee_type foreign key (employee_type_id) references employee_type (id),
    constraint uk_team_employee_type unique (team_id, employee_type_id)
);

create index if not exists idx_team_employee_type_team on team_employee_type (team_id);
create index if not exists idx_team_employee_type_employee_type on team_employee_type (employee_type_id);

create table if not exists operation_day_team
(
    id               bigserial not null primary key,
    operation_day_id bigint    not null,
    team_id          bigint    not null,
    required_count   int       not null default 1,
    constraint fk_operation_day_team_operation_day foreign key (operation_day_id) references operation_day (id),
    constraint fk_operation_day_team_team foreign key (team_id) references team (id),
    constraint uk_operation_day_team unique (operation_day_id, team_id)
);

create index if not exists idx_operation_day_team_operation_day on operation_day_team (operation_day_id);
create index if not exists idx_operation_day_team_team on operation_day_team (team_id);
