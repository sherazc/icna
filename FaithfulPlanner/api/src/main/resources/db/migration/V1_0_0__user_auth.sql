create table company
(
    id                        bigserial    not null,
    company_name              varchar(255) not null,
    active                    boolean,
    primary key (id),
    constraint uk_company_name unique (company_name)
);

create table user_role
(
    id        bigserial    not null,
    role_name varchar(255) not null,
    primary key (id)
);

create table user_profile
(
    id            bigserial    not null primary key,
    email         varchar(255) not null,
    user_password varchar(1024),
    first_name    varchar(255),
    last_name     varchar(255),
    phone_number  varchar(50),
    company_id      bigint,
    constraint uk_user_profile_email_company unique (email, company_id)
);


create table m2m_user_profile_user_role
(
    user_profile_id bigint not null,
    user_role_id    bigint not null,
    primary key (user_profile_id, user_role_id)
);

alter table user_profile
    add constraint fk_user_profile_company
        foreign key (company_id)
            references company (id);

alter table m2m_user_profile_user_role
    add constraint fk_m2m_user_profile
        foreign key (user_profile_id)
            references user_profile (id);

alter table m2m_user_profile_user_role
    add constraint fk_m2m_user_role
        foreign key (user_role_id)
            references user_role (id);

