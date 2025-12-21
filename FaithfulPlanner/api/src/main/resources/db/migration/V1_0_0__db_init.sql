create table company
(
    id                        bigserial    not null,
    company_name              varchar(255) not null,
    start_date                timestamp,
    end_date                  timestamp,
    active                    boolean,
    enable_monetization       boolean,
    enable_group_registration boolean,
    enable_start_end_date     boolean,
    primary key (id)
);

create table user_role
(
    id        bigserial    not null,
    role_name varchar(255) not null,
    primary key (id)
);

create table user_profile
(
    id            bigserial    not null,
    email         varchar(255) not null,
    user_password varchar(255),
    company_id      bigint,
    primary key (id)
);


create table m2m_user_profile_user_role
(
    user_profile_id bigint not null,
    user_role_id    bigint not null,
    primary key (user_profile_id, user_role_id)
);
