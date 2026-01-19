create table employee_type
(
    id        bigserial    not null primary key,
    type_name varchar(255) not null
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

INSERT INTO employee_type (id, type_name)
VALUES (1, 'Nurse'),
       (2, 'Receptionist'),
       (3, 'Medical Assistant'),
       (4, 'Lab Technician'),
       (5, 'Pharmacist'),
       (6, 'Physical Therapist'),
       (7, 'Administrative Staff'),
       (8, 'Billing Specialist');

SELECT setval(pg_get_serial_sequence('employee_type', 'id'), (SELECT MAX(id) FROM employee_type));

-- Insert sample employees (volunteers) for company id 1 (clinic)
INSERT INTO employee (id, first_name, last_name, email, phone_number, company_id)
VALUES (1, 'Jennifer', 'Davis', 'jennifer.davis@clinic.com', '(555) 234-5601', 1),
       (2, 'Robert', 'Miller', 'robert.miller@clinic.com', '(555) 234-5602', 1),
       (3, 'Jessica', 'Wilson', 'jessica.wilson@clinic.com', '(555) 234-5603', 1),
       (4, 'Christopher', 'Moore', 'christopher.moore@clinic.com', '(555) 234-5604', 1),
       (5, 'Amanda', 'Taylor', 'amanda.taylor@clinic.com', '(555) 234-5605', 1),
       (6, 'Matthew', 'Anderson', 'matthew.anderson@clinic.com', '(555) 234-5606', 1),
       (7, 'Ashley', 'Thomas', 'ashley.thomas@clinic.com', '(555) 234-5607', 1),
       (8, 'Daniel', 'Jackson', 'daniel.jackson@clinic.com', '(555) 234-5608', 1);

SELECT setval(pg_get_serial_sequence('employee', 'id'), (SELECT MAX(id) FROM employee));

-- Assign employee types to employees (allowing multiple types per employee)
INSERT INTO m2m_employee_employee_type (employee_id, employee_type_id)
VALUES (1, 1), -- Jennifer Davis: Nurse
       (2, 2), -- Robert Miller: Receptionist
       (3, 3), -- Jessica Wilson: Medical Assistant
       (4, 4), -- Christopher Moore: Lab Technician
       (5, 5), -- Amanda Taylor: Pharmacist
       (6, 6), -- Matthew Anderson: Physical Therapist
       (7, 7), -- Ashley Thomas: Administrative Staff
       (8, 8), -- Daniel Jackson: Billing Specialist
       (1, 3), -- Jennifer Davis also: Medical Assistant (example of multiple types)
       (7, 2); -- Ashley Thomas also: Receptionist (example of multiple types)



