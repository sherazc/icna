create table employee_type
(
    id        bigserial    not null primary key,
    type_name varchar(255) not null,
    employee_type_group varchar(50) not null
);

create table employee
(
    id             bigserial    not null primary key,
    first_name     varchar(255) not null,
    last_name      varchar(255) not null,
    email          varchar(255),
    phone_number   varchar(50),
    company_id     bigint,
    constraint fk_employee_company foreign key (company_id) references company (id)
);

create table m2m_employee_employee_type
(
    employee_id bigint not null,
    employee_type_id bigint not null,
    primary key (employee_id, employee_type_id),
    constraint fk_employee_employee_type_employee foreign key (employee_id) references employee(id),
    constraint fk_employee_employee_type_employee_type foreign key (employee_type_id) references employee_type(id)
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

-- Insert sample employees (providers - from old provider table)
INSERT INTO employee (id, first_name, last_name, email, phone_number, company_id)
VALUES (1, 'John', 'Smith', 'john.smith@clinic.com', '(555) 123-4501', 1),
       (2, 'Sarah', 'Johnson', 'sarah.johnson@clinic.com', '(555) 123-4502', 1),
       (3, 'Michael', 'Williams', 'michael.williams@clinic.com', '(555) 123-4503', 1),
       (4, 'Emily', 'Brown', 'emily.brown@clinic.com', '(555) 123-4504', 1),
       (5, 'David', 'Jones', 'david.jones@clinic.com', '(555) 123-4505', 1);

-- Insert sample employees (volunteers - from old worker table)
INSERT INTO employee (id, first_name, last_name, email, phone_number, company_id)
VALUES (6, 'Jennifer', 'Davis', 'jennifer.davis@clinic.com', '(555) 234-5601', 1),
       (7, 'Robert', 'Miller', 'robert.miller@clinic.com', '(555) 234-5602', 1),
       (8, 'Jessica', 'Wilson', 'jessica.wilson@clinic.com', '(555) 234-5603', 1),
       (9, 'Christopher', 'Moore', 'christopher.moore@clinic.com', '(555) 234-5604', 1),
       (10, 'Amanda', 'Taylor', 'amanda.taylor@clinic.com', '(555) 234-5605', 1),
       (11, 'Matthew', 'Anderson', 'matthew.anderson@clinic.com', '(555) 234-5606', 1),
       (12, 'Ashley', 'Thomas', 'ashley.thomas@clinic.com', '(555) 234-5607', 1),
       (13, 'Daniel', 'Jackson', 'daniel.jackson@clinic.com', '(555) 234-5608', 1);

SELECT setval(pg_get_serial_sequence('employee', 'id'), (SELECT MAX(id) FROM employee));

-- Assign employee types to employees (allowing multiple types per employee)
-- Provider assignments (from old provider table)
INSERT INTO m2m_employee_employee_type (employee_id, employee_type_id)
VALUES (1, 1), -- John Smith: General Practitioner
       (2, 2), -- Sarah Johnson: Pediatrician
       (3, 3), -- Michael Williams: Cardiologist
       (4, 4), -- Emily Brown: Dermatologist
       (5, 5), -- David Jones: Orthopedic Surgeon
       (5, 1); -- David Jones also: General Practitioner (example of multiple types)

-- Volunteer assignments (from old worker table)
INSERT INTO m2m_employee_employee_type (employee_id, employee_type_id)
VALUES (6, 9),  -- Jennifer Davis: Nurse
       (7, 10), -- Robert Miller: Receptionist
       (8, 11), -- Jessica Wilson: Medical Assistant
       (9, 12), -- Christopher Moore: Lab Technician
       (10, 13), -- Amanda Taylor: Pharmacist
       (11, 14), -- Matthew Anderson: Physical Therapist
       (12, 15), -- Ashley Thomas: Administrative Staff
       (13, 16), -- Daniel Jackson: Billing Specialist
       (6, 11), -- Jennifer Davis also: Medical Assistant (example of multiple types)
       (12, 10); -- Ashley Thomas also: Receptionist (example of multiple types)




