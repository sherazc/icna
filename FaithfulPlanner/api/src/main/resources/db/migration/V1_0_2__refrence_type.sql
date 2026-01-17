create table ref_provider_type
(
    id        bigserial    not null primary key,
    type_name varchar(255) not null
);

create table ref_worker_type
(
    id        bigserial    not null primary key,
    type_name varchar(255) not null
);

INSERT INTO ref_provider_type (id, type_name)
VALUES (1, 'General Practitioner'),
       (2, 'Pediatrician'),
       (3, 'Cardiologist'),
       (4, 'Dermatologist'),
       (5, 'Orthopedic Surgeon'),
       (6, 'Psychiatrist'),
       (7, 'Dentist'),
       (8, 'Ophthalmologist');

INSERT INTO ref_worker_type (id, type_name)
VALUES (1, 'Nurse'),
       (2, 'Receptionist'),
       (3, 'Medical Assistant'),
       (4, 'Lab Technician'),
       (5, 'Pharmacist'),
       (6, 'Physical Therapist'),
       (7, 'Administrative Staff'),
       (8, 'Billing Specialist');

-- Reset sequences to continue from the last inserted ID
SELECT setval(pg_get_serial_sequence('ref_provider_type', 'id'), (SELECT MAX(id) FROM ref_provider_type));
SELECT setval(pg_get_serial_sequence('ref_worker_type', 'id'), (SELECT MAX(id) FROM ref_worker_type));
