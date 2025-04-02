

create table attendee
(
    id              bigint       not null auto_increment,
    first_name      varchar(255) not null,
    last_name       varchar(255) not null,
    registration_id bigint,
    primary key (id)
);


create table event
(
    id         bigint       not null auto_increment,
    event_name varchar(255) not null,
    start_date datetime,
    end_date   datetime,
    active     boolean,
    enable_monetization     boolean,
    enable_group_registration     boolean,
    enable_start_end_date     boolean,
    primary key (id)
);


create table event_program
(
    id           bigint       not null auto_increment,
    program_name varchar(255) not null,
    event_id     bigint       not null,
    primary key (id)
);


create table m2m_event_program_attendee
(
    attendee_id      bigint not null,
    event_program_id bigint not null,
    primary key (attendee_id, event_program_id)
);


create table m2m_user_profile_user_role
(
    user_profile_id bigint not null,
    user_role_id    bigint not null,
    primary key (user_profile_id, user_role_id)
);


create table registration
(
    id              bigint not null auto_increment,
    event_id        bigint not null,
    user_profile_id bigint,
    primary key (id)
);


create table style
(
    id          bigint not null auto_increment,
    style_name  varchar(255),
    style_type  varchar(255),
    style_value varchar(255),
    event_id    bigint not null,
    primary key (id)
);


create table user_profile
(
    id            bigint       not null auto_increment,
    email         varchar(255) not null,
    user_password varchar(255),
    event_id      bigint,
    primary key (id)
);


create table user_role
(
    id        bigint       not null auto_increment,
    role_name varchar(255) not null,
    primary key (id)
);


-- Payments
create table payment_setting
(
    id                   bigint        not null auto_increment,
    event_id             bigint        not null,
    payment_provider_key varchar(1000) not null,
    active               boolean,
    primary key (id)
);


create table product
(
    id           bigint       not null auto_increment,
    event_id     bigint       not null,
    product_name varchar(255) not null,
    price_cents  bigint       not null,
    primary key (id)
);


create table event_order
(
    id                 bigint       not null auto_increment,
    registration_id    bigint       not null,
    price_cents        bigint       not null,
    payment_status     varchar(255) not null,
    create_date        datetime,
    last_modified_date datetime,
    primary key (id)
);


create table order_line_item
(
    id                   bigint not null auto_increment,
    event_order_id       bigint not null,
    price_cents_at_order bigint not null,
    product_id           bigint not null,
    primary key (id)
);

alter table registration
    add constraint UK_registration_user_profile_id unique (user_profile_id);

alter table attendee
    add constraint FK_attendee_registration_id
        foreign key (registration_id)
            references registration (id);

alter table event_program
    add constraint FK_event_program_event_id
        foreign key (event_id)
            references event (id);

alter table m2m_event_program_attendee
    add constraint FK_m2m_event_program_attendee_event_program_id
        foreign key (event_program_id)
            references event_program (id);

alter table m2m_event_program_attendee
    add constraint FK_m2m_event_program_attendee_attendee_id
        foreign key (attendee_id)
            references attendee (id);

alter table m2m_user_profile_user_role
    add constraint FK_m2m_user_profile_user_role_user_role_id
        foreign key (user_role_id)
            references user_role (id);

alter table m2m_user_profile_user_role
    add constraint FK_m2m_user_profile_user_role_user_profile_id
        foreign key (user_profile_id)
            references user_profile (id);

alter table registration
    add constraint FK_registration_event_id
        foreign key (event_id)
            references event (id);

alter table registration
    add constraint FK_registration_user_profile_id
        foreign key (user_profile_id)
            references user_profile (id);

alter table style
    add constraint FK_style_event_id
        foreign key (event_id)
            references event (id);

alter table user_profile
    add constraint FK_user_profile_event_id
        foreign key (event_id)
            references event (id);


alter table payment_setting
    add constraint fk_payment_setting_event_id
        foreign key (event_id)
            references event (id);


alter table product
    add constraint fk_product_event_id
        foreign key (event_id)
            references event (id);


alter table event_order
    add constraint fk_event_order_registration_id
        foreign key (registration_id)
            references user_profile (id);


alter table order_line_item
    add constraint fk_order_line_item_event_order_id
        foreign key (event_order_id)
            references event_order (id);


alter table order_line_item
    add constraint fk_order_line_item_product_id
        foreign key (product_id)
            references product (id);
