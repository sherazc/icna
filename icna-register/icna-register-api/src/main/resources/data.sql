insert into event (id, event_name)
values (10, 'ICNA Conference 2024');

insert into Registration (id, event_id)
values (100, 10);

insert into Attendee (id, registration_id, first_name, last_name)
values (1000, 100, 'Sheraz', 'Chaudhry');

insert into Attendee (id, registration_id, first_name, last_name)
values (1010, 100, 'Abrar', 'Chaudhry');

insert into Attendee (id, registration_id, first_name, last_name)
values (1020, 100, 'Faraz', 'Chaudhry');
