-- Event
insert into event (id, event_name)
values (10, 'EVENT Conference 2024');

insert into event_program (id, event_id, program_name)
values (10000, 10, 'Lecture Mounzer Taleb');

insert into event_program (id, event_id, program_name)
values (10010, 10, 'Quiz Competition');


-- Auth

insert into user_role(id, role_name)
values (400, 'ADMIN');

insert into user_role(id, role_name)
values (410, 'ASSISTANT');

insert into user_role(id, role_name)
values (420, 'BASIC_USER');


insert into user_profile(id, email, user_password, event_id)
values (700, 'admin@event.com', '{noop}abc', 10);

insert into user_profile(id, email, user_password, event_id)
values (710, 'assitant@event.com', '{noop}abc', 10);

insert into user_profile(id, email, user_password, event_id)
values (720, 'basic_user_sheraz@event.com', '{noop}abc', 10);

insert into user_profile(id, email, user_password, event_id)
values (730, 'basic_user_baker@event.com', '{noop}abc', 10);


insert into m2m_user_profile_user_role(user_profile_id, user_role_id)
values (700, 400);

insert into m2m_user_profile_user_role(user_profile_id,user_role_id)
values(700,410);

insert into m2m_user_profile_user_role(user_profile_id,user_role_id)
values(700,420);

insert into m2m_user_profile_user_role(user_profile_id,user_role_id)
values(710,410);

insert into m2m_user_profile_user_role(user_profile_id,user_role_id)
values(710,420);

insert into m2m_user_profile_user_role(user_profile_id,user_role_id)
values(720,420);


-- Registrations
insert into Registration (id, event_id, user_profile_id)
values (100, 10, 720);

insert into Registration (id, event_id, user_profile_id)
values (110, 10, 730);


insert into Attendee (id, registration_id, first_name, last_name)
values (1000, 100, 'Sheraz', 'Chaudhry');

insert into Attendee (id, registration_id, first_name, last_name)
values (1010, 100, 'Abrar', 'Chaudhry');

insert into Attendee (id, registration_id, first_name, last_name)
values (1020, 100, 'Faraz', 'Chaudhry');

insert into Attendee (id, registration_id, first_name, last_name)
values (1021, 100, 'Sagheer', 'Nizami');

insert into Attendee (id, registration_id, first_name, last_name)
values (1022, 100, 'Muhammad', 'Nadeem');

insert into Attendee (id, registration_id, first_name, last_name)
values (1030, 110, 'Muhammad', 'Bakar');

insert into Attendee (id, registration_id, first_name, last_name)
values (1040, 110, 'Muhammad', 'Hammad');


insert into M2M_EVENT_PROGRAM_ATTENDEE (ATTENDEE_ID, EVENT_PROGRAM_ID)
values (1000, 10000);

insert into M2M_EVENT_PROGRAM_ATTENDEE (ATTENDEE_ID, EVENT_PROGRAM_ID)
values (1000, 10010);

insert into M2M_EVENT_PROGRAM_ATTENDEE (ATTENDEE_ID, EVENT_PROGRAM_ID)
values (1030, 10000);

-- UI

-- insert into STYLE (ID, EVENT_ID, style_type, style_name, style_value)
-- values (5000, 10, 0, 'colorPrimary', '#B8478B');
--
-- insert into STYLE (ID, EVENT_ID, style_type, style_name, style_value)
-- values (5010, 10, 0, 'colorSecondary', '#47B874');
--
-- insert into STYLE (ID, EVENT_ID, style_type, style_name, style_value)
-- values (5020, 10, 0, 'borderRadiusForm', '20px');

