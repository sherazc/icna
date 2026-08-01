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
