create table employee_group
(
    id         bigserial    not null primary key,
    group_name varchar(255) not null,
    company_id bigint       not null,
    constraint fk_employee_group_company foreign key (company_id) references company(id)
);

create table employee_type
(
    id                bigserial    not null primary key,
    type_name         varchar(255) not null,
    employee_group_id bigint       not null,
    constraint fk_employee_type_employee_group foreign key (employee_group_id) references employee_group(id)
);

create table m2m_user_profile_employee_type
(
    user_profile_id bigint not null,
    employee_type_id bigint not null,
    primary key (user_profile_id, employee_type_id),
    constraint fk_user_profile_employee_type_user_profile foreign key (user_profile_id) references user_profile(id),
    constraint fk_user_profile_employee_type_employee_type foreign key (employee_type_id) references employee_type(id)
);

alter table user_profile
    add column employee_group_id bigint;

alter table user_profile
    add constraint fk_user_profile_employee_group
        foreign key (employee_group_id)
            references employee_group(id);
