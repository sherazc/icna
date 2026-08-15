create table company
(
    id                        bigserial    not null,
    company_name              varchar(255) not null,
    ui_theme_id               bigint,
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

-- Refresh Token
create table refresh_token
(
    id               bigserial    not null primary key,
    user_profile_id  bigint       not null,
    token_hash       varchar(255) not null,
    expires_at       timestamp    not null,
    revoked_at       timestamp,
    created_at       timestamp    not null default now(),
    constraint uk_refresh_token_hash unique (token_hash)
);

alter table refresh_token
    add constraint fk_refresh_token_user_profile
        foreign key (user_profile_id)
            references user_profile (id);

-- Insert 3 roles with explicit IDs
INSERT INTO user_role (id, role_name)
VALUES
    (1, 'MASTER'),
    (2, 'ADMIN'),
    (3, 'BASIC_USER');

SELECT setval(pg_get_serial_sequence('user_role', 'id'), (SELECT COALESCE(MAX(id), 0) FROM user_role) + 1);
