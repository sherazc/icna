create table employee_type
(
    id        bigserial    not null primary key,
    type_name varchar(255) not null,
    employee_type_group varchar(50) not null
);

create table m2m_user_profile_employee_type
(
    user_profile_id bigint not null,
    employee_type_id bigint not null,
    primary key (user_profile_id, employee_type_id),
    constraint fk_user_profile_employee_type_user_profile foreign key (user_profile_id) references user_profile(id),
    constraint fk_user_profile_employee_type_employee_type foreign key (employee_type_id) references employee_type(id)
);

-- Insert employee types - PROVIDER group (from old provider_type table)
INSERT INTO employee_type (id, type_name, employee_type_group)
VALUES (1, 'General Practitioner', 'PROVIDER'),
       (2, 'Pediatrician', 'PROVIDER'),
       (3, 'Cardiologist', 'PROVIDER'),
       (4, 'Dermatologist', 'PROVIDER'),
       (5, 'Orthopedic Surgeon', 'PROVIDER'),
       (6, 'Psychiatrist', 'PROVIDER'),
       (7, 'Dentist', 'PROVIDER'),
       (8, 'Ophthalmologist', 'PROVIDER');

-- Insert employee types - VOLUNTEER group (from old worker_type table)
INSERT INTO employee_type (id, type_name, employee_type_group)
VALUES (9, 'Nurse', 'VOLUNTEER'),
       (10, 'Receptionist', 'VOLUNTEER'),
       (11, 'Medical Assistant', 'VOLUNTEER'),
       (12, 'Lab Technician', 'VOLUNTEER'),
       (13, 'Pharmacist', 'VOLUNTEER'),
       (14, 'Physical Therapist', 'VOLUNTEER'),
       (15, 'Administrative Staff', 'VOLUNTEER'),
       (16, 'Billing Specialist', 'VOLUNTEER');

SELECT setval(pg_get_serial_sequence('employee_type', 'id'), (SELECT MAX(id) FROM employee_type));

-- Insert sample user profiles with employee data (providers)
INSERT INTO user_profile (id, email, first_name, last_name, phone_number, company_id, user_password)
VALUES (10, 'john.smith@employee.local', 'John', 'Smith', '(555) 123-4501', 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (11, 'sarah.johnson@employee.local', 'Sarah', 'Johnson', '(555) 123-4502', 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (12, 'michael.williams@employee.local', 'Michael', 'Williams', '(555) 123-4503', 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (13, 'emily.brown@employee.local', 'Emily', 'Brown', '(555) 123-4504', 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (14, 'david.jones@employee.local', 'David', 'Jones', '(555) 123-4505', 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa');

-- Insert sample user profiles with employee data (volunteers)
INSERT INTO user_profile (id, email, first_name, last_name, phone_number, company_id, user_password)
VALUES (15, 'jennifer.davis@employee.local', 'Jennifer', 'Davis', '(555) 234-5601', 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (16, 'robert.miller@employee.local', 'Robert', 'Miller', '(555) 234-5602', 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (17, 'jessica.wilson@employee.local', 'Jessica', 'Wilson', '(555) 234-5603', 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (18, 'christopher.moore@employee.local', 'Christopher', 'Moore', '(555) 234-5604', 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (19, 'amanda.taylor@employee.local', 'Amanda', 'Taylor', '(555) 234-5605', 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (20, 'matthew.anderson@employee.local', 'Matthew', 'Anderson', '(555) 234-5606', 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (21, 'ashley.thomas@employee.local', 'Ashley', 'Thomas', '(555) 234-5607', 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (22, 'daniel.jackson@employee.local', 'Daniel', 'Jackson', '(555) 234-5608', 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa');

SELECT setval(pg_get_serial_sequence('user_profile', 'id'), (SELECT MAX(id) FROM user_profile));

-- Assign employee types to user profiles (allowing multiple types per user)
-- Provider assignments
INSERT INTO m2m_user_profile_employee_type (user_profile_id, employee_type_id)
VALUES (10, 1), -- John Smith: General Practitioner
       (11, 2), -- Sarah Johnson: Pediatrician
       (12, 3), -- Michael Williams: Cardiologist
       (13, 4), -- Emily Brown: Dermatologist
       (14, 5), -- David Jones: Orthopedic Surgeon
       (14, 1); -- David Jones also: General Practitioner (example of multiple types)

-- Volunteer assignments
INSERT INTO m2m_user_profile_employee_type (user_profile_id, employee_type_id)
VALUES (15, 9),  -- Jennifer Davis: Nurse
       (16, 10), -- Robert Miller: Receptionist
       (17, 11), -- Jessica Wilson: Medical Assistant
       (18, 12), -- Christopher Moore: Lab Technician
       (19, 13), -- Amanda Taylor: Pharmacist
       (20, 14), -- Matthew Anderson: Physical Therapist
       (21, 15), -- Ashley Thomas: Administrative Staff
       (22, 16), -- Daniel Jackson: Billing Specialist
       (15, 11), -- Jennifer Davis also: Medical Assistant (example of multiple types)
       (21, 10); -- Ashley Thomas also: Receptionist (example of multiple types)




