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
    end_date datetime,
    active boolean,
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
    id               bigint       not null auto_increment,
    event_id         bigint not null,
    payment_provider_key varchar(1000) not null,
    active boolean,
    primary key (id)
);


create table product
(
    id        bigint       not null auto_increment,
    product_name varchar(255) not null,
    price_cents bigint       not null,
    primary key (id)
);


create table event_order
(
    id        bigint       not null auto_increment,
    user_profile_id bigint not null,
    price_cents bigint       not null,
    primary key (id)
);





alter table registration
    add constraint UKpadvmihswakdrju5mryhgjc25 unique (user_profile_id);

alter table attendee
    add constraint FKdn74gf1hhojumjwhf3eja66gs
        foreign key (registration_id)
            references registration (id);

alter table event_program
    add constraint FKmcrub2ppya8msr0057t78x6m4
        foreign key (event_id)
            references event (id);

alter table m2m_event_program_attendee
    add constraint FK23p0dkrg84wn44ljqywv7ykg4
        foreign key (event_program_id)
            references event_program (id);

alter table m2m_event_program_attendee
    add constraint FKnmbm9b89nc9oqcqps398hrpg4
        foreign key (attendee_id)
            references attendee (id);

alter table m2m_user_profile_user_role
    add constraint FKmdl4jamxrxx9vj55w1rrnlif4
        foreign key (user_role_id)
            references user_role (id);

alter table m2m_user_profile_user_role
    add constraint FKti23b99jbg468jb6l7d424352
        foreign key (user_profile_id)
            references user_profile (id);

alter table registration
    add constraint FKs4x1uat6i8fx26qpdrfwfg3ya
        foreign key (event_id)
            references event (id);

alter table registration
    add constraint FKqe01jwvdp30av1lgw39xw88bd
        foreign key (user_profile_id)
            references user_profile (id);

alter table style
    add constraint FK6iasijmdr0scw2dqejii67fe6
        foreign key (event_id)
            references event (id);

alter table user_profile
    add constraint FKmnvck6gsvmfv3nmguyu0g9oip
        foreign key (event_id)
            references event (id)



