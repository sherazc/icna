-- Insert 3 companies (Muslim clinics) with explicit IDs
INSERT INTO company (id, company_name, ui_theme_id, active)
VALUES
    (1, 'Al-Shifa Health Clinic', 10, true),
    (2, 'Rahma Medical Center', 20, true),
    (3, 'Barakah Community Clinic', 30, true);

-- Insert users for Al-Shifa Health Clinic (company_id = 1) with explicit IDs
INSERT INTO user_profile (id, email, user_password, company_id)
VALUES
    (1, 'sheraz@alshifa.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 1),      -- MASTER
    (2, 'tariq@alshifa.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 1),       -- ADMIN
    (3, 'chaudhry@alshifa.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 1);    -- BASIC_USER

-- Insert users for Rahma Medical Center (company_id = 2) with explicit IDs
INSERT INTO user_profile (id, email, user_password, company_id)
VALUES
    (4, 'abrar@rahma.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 2),         -- MASTER
    (5, 'faraz@rahma.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 2),         -- ADMIN
    (6, 'sheraz@rahma.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 2);        -- BASIC_USER

-- Insert users for Barakah Community Clinic (company_id = 3) with explicit IDs
INSERT INTO user_profile (id, email, user_password, company_id)
VALUES
    (7, 'tariq@barakah.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 3),       -- MASTER
    (8, 'chaudhry@barakah.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 3),    -- ADMIN
    (9, 'abrar@barakah.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 3);       -- BASIC_USER

-- Assign roles to Al-Shifa Health Clinic users (all users get BASIC_USER + their primary role)
INSERT INTO m2m_user_profile_user_role (user_profile_id, user_role_id)
VALUES
    (1, 1),  -- Sheraz - MASTER
    (1, 3),  -- Sheraz - BASIC_USER
    (2, 2),  -- Tariq - ADMIN
    (2, 3),  -- Tariq - BASIC_USER
    (3, 3);  -- Chaudhry - BASIC_USER

-- Assign roles to Rahma Medical Center users (all users get BASIC_USER + their primary role)
INSERT INTO m2m_user_profile_user_role (user_profile_id, user_role_id)
VALUES
    (4, 1),  -- Abrar - MASTER
    (4, 3),  -- Abrar - BASIC_USER
    (5, 2),  -- Faraz - ADMIN
    (5, 3),  -- Faraz - BASIC_USER
    (6, 3);  -- Sheraz - BASIC_USER

-- Assign roles to Barakah Community Clinic users (all users get BASIC_USER + their primary role)
INSERT INTO m2m_user_profile_user_role (user_profile_id, user_role_id)
VALUES
    (7, 1),  -- Tariq - MASTER
    (7, 3),  -- Tariq - BASIC_USER
    (8, 2),  -- Chaudhry - ADMIN
    (8, 3),  -- Chaudhry - BASIC_USER
    (9, 3);  -- Abrar - BASIC_USER

-- Reset IDENTITY sequences to start from the next available ID
SELECT setval(pg_get_serial_sequence('company', 'id'), (SELECT COALESCE(MAX(id), 0) FROM company) + 1);
SELECT setval(pg_get_serial_sequence('user_profile', 'id'), (SELECT COALESCE(MAX(id), 0) FROM user_profile) + 1);

-- Insert employee groups
INSERT INTO employee_group (id, group_name, company_id)
VALUES (1, 'PROVIDER', 1),
       (2, 'VOLUNTEER', 1);

SELECT setval(pg_get_serial_sequence('employee_group', 'id'), (SELECT MAX(id) FROM employee_group));

-- Insert employee types - PROVIDER group (from old provider_type table)
INSERT INTO employee_type (id, type_name, employee_group_id)
VALUES (1, 'General Practitioner', 1),
       (2, 'Pediatrician', 1),
       (3, 'Cardiologist', 1),
       (4, 'Dermatologist', 1),
       (5, 'Orthopedic Surgeon', 1),
       (6, 'Psychiatrist', 1),
       (7, 'Dentist', 1),
       (8, 'Ophthalmologist', 1);

-- Insert employee types - VOLUNTEER group (from old worker_type table)
INSERT INTO employee_type (id, type_name, employee_group_id)
VALUES (9, 'Nurse', 2),
       (10, 'Receptionist', 2),
       (11, 'Medical Assistant', 2),
       (12, 'Lab Technician', 2),
       (13, 'Pharmacist', 2),
       (14, 'Physical Therapist', 2),
       (15, 'Administrative Staff', 2),
       (16, 'Billing Specialist', 2);

SELECT setval(pg_get_serial_sequence('employee_type', 'id'), (SELECT MAX(id) FROM employee_type));

-- Insert sample user profiles with employee data (providers)
INSERT INTO user_profile (id, email, first_name, last_name, phone_number, company_id, employee_group_id, user_password)
VALUES (10, 'john.smith@employee.local', 'John', 'Smith', '(555) 123-4501', 1, 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (11, 'sarah.johnson@employee.local', 'Sarah', 'Johnson', '(555) 123-4502', 1, 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (12, 'michael.williams@employee.local', 'Michael', 'Williams', '(555) 123-4503', 1, 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (13, 'emily.brown@employee.local', 'Emily', 'Brown', '(555) 123-4504', 1, 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (14, 'david.jones@employee.local', 'David', 'Jones', '(555) 123-4505', 1, 1, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa');

-- Insert sample user profiles with employee data (volunteers)
INSERT INTO user_profile (id, email, first_name, last_name, phone_number, company_id, employee_group_id, user_password)
VALUES (15, 'jennifer.davis@employee.local', 'Jennifer', 'Davis', '(555) 234-5601', 1, 2, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (16, 'robert.miller@employee.local', 'Robert', 'Miller', '(555) 234-5602', 1, 2, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (17, 'jessica.wilson@employee.local', 'Jessica', 'Wilson', '(555) 234-5603', 1, 2, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (18, 'christopher.moore@employee.local', 'Christopher', 'Moore', '(555) 234-5604', 1, 2, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (19, 'amanda.taylor@employee.local', 'Amanda', 'Taylor', '(555) 234-5605', 1, 2, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (20, 'matthew.anderson@employee.local', 'Matthew', 'Anderson', '(555) 234-5606', 1, 2, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (21, 'ashley.thomas@employee.local', 'Ashley', 'Thomas', '(555) 234-5607', 1, 2, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa'),
       (22, 'daniel.jackson@employee.local', 'Daniel', 'Jackson', '(555) 234-5608', 1, 2, '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa');

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

-- Sample operation dates for company 1 (next few weekends)
INSERT INTO operation_day (id, company_id, service_date, notes)
VALUES
    (1, 1, '2026-01-24', 'Saturday clinic'),
    (2, 1, '2026-01-25', 'Sunday clinic'),
    (3, 1, '2026-01-31', 'Saturday clinic'),
    (4, 1, '2026-02-01', 'Sunday clinic'),
    (5, 1, '2026-02-07', 'Saturday clinic');

SELECT setval(pg_get_serial_sequence('operation_day', 'id'), (SELECT MAX(id) FROM operation_day));

-- Sample schedule assignments
-- Assign user_profile 10 (John Smith - Provider) to first Saturday
INSERT INTO schedule (id, operation_day_id, user_profile_id)
VALUES (1, 1, 10);

-- Assign user_profile 11 (Sarah Johnson - Provider) to first Saturday
INSERT INTO schedule (id, operation_day_id, user_profile_id)
VALUES (2, 1, 11);

-- Assign user_profile 15 (Jennifer Davis - Volunteer) to first Saturday
INSERT INTO schedule (id, operation_day_id, user_profile_id)
VALUES (3, 1, 15);

-- Assign user_profile 17 (Jessica Wilson - Volunteer) to first Saturday
INSERT INTO schedule (id, operation_day_id, user_profile_id)
VALUES (4, 1, 17);

SELECT setval(pg_get_serial_sequence('schedule', 'id'), (SELECT MAX(id) FROM schedule));