create table ref_employee_type
(
    id        bigserial    not null primary key,
    type_name varchar(255) not null,
    employee_type_group varchar(50) not null
);

-- Insert PROVIDER types (from old ref_provider_type)
INSERT INTO ref_employee_type (id, type_name, employee_type_group)
VALUES (1, 'General Practitioner', 'PROVIDER'),
       (2, 'Pediatrician', 'PROVIDER'),
       (3, 'Cardiologist', 'PROVIDER'),
       (4, 'Dermatologist', 'PROVIDER'),
       (5, 'Orthopedic Surgeon', 'PROVIDER'),
       (6, 'Psychiatrist', 'PROVIDER'),
       (7, 'Dentist', 'PROVIDER'),
       (8, 'Ophthalmologist', 'PROVIDER');

-- Insert VOLUNTEER types (from old ref_worker_type)
INSERT INTO ref_employee_type (id, type_name, employee_type_group)
VALUES (9, 'Nurse', 'VOLUNTEER'),
       (10, 'Receptionist', 'VOLUNTEER'),
       (11, 'Medical Assistant', 'VOLUNTEER'),
       (12, 'Lab Technician', 'VOLUNTEER'),
       (13, 'Pharmacist', 'VOLUNTEER'),
       (14, 'Physical Therapist', 'VOLUNTEER'),
       (15, 'Administrative Staff', 'VOLUNTEER'),
       (16, 'Billing Specialist', 'VOLUNTEER');

-- Reset sequences to continue from the last inserted ID
SELECT setval(pg_get_serial_sequence('ref_employee_type', 'id'), (SELECT MAX(id) FROM ref_employee_type));


