-- One row per team instance on an operation day (instance_no 1..operation_day_team.required_team_count).
-- Rows must be created/removed whenever required_team_count changes.
create table operation_day_team_instance
(
    operation_day_id bigint not null,
    team_id          bigint not null,
    instance_no      int    not null,
    primary key (operation_day_id, team_id, instance_no),
    constraint fk_operation_day_team_instance_operation_day_team
        foreign key (operation_day_id, team_id)
        references operation_day_team (operation_day_id, team_id)
);

-- Assign a user to a specific team instance and employee type on an operation day.
-- All three are null when the user is scheduled on the day but not placed on a spot (Extra Users).
alter table schedule
    add column team_id bigint,
    add column employee_type_id bigint,
    add column team_instance_no int;

alter table schedule
    add constraint ck_schedule_spot_all_or_none check (
        (team_id is null and employee_type_id is null and team_instance_no is null)
        or (team_id is not null and employee_type_id is not null and team_instance_no is not null)
    );

-- The team instance exists on that operation day (also ensures the team runs that day)
alter table schedule
    add constraint fk_schedule_operation_day_team_instance
        foreign key (operation_day_id, team_id, team_instance_no)
        references operation_day_team_instance (operation_day_id, team_id, instance_no);

-- The team requires that employee type
alter table schedule
    add constraint fk_schedule_team_employee_type
        foreign key (team_id, employee_type_id)
        references team_employee_type (team_id, employee_type_id);

-- The user holds that employee type
alter table schedule
    add constraint fk_schedule_user_employee_type
        foreign key (user_profile_id, employee_type_id)
        references m2m_user_profile_employee_type (user_profile_id, employee_type_id);

-- Supports counting filled spots per team instance and employee type
create index idx_schedule_assignment
    on schedule (operation_day_id, team_id, team_instance_no, employee_type_id);
