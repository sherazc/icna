create table provider_type
(
    id        bigserial    not null primary key,
    type_name varchar(255) not null
);

create table provider
(
    id        bigserial    not null primary key,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    company_id      bigint,
    provider_type_id bigint
);
