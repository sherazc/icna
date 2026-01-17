create table worker_type
(
    id        bigserial    not null primary key,
    type_name varchar(255) not null
);

create table worker
(
    id             bigserial    not null primary key,
    first_name     varchar(255) not null,
    last_name      varchar(255) not null,
    email          varchar(255),
    phone_number   varchar(50),
    company_id     bigint,
    worker_type_id bigint,
    constraint fk_worker_worker_type foreign key (worker_type_id) references worker_type (id),
    constraint fk_worker_company foreign key (company_id) references company (id)
);

INSERT INTO worker_type (id, type_name)
VALUES (1, 'Nurse'),
       (2, 'Receptionist'),
       (3, 'Medical Assistant'),
       (4, 'Lab Technician'),
       (5, 'Pharmacist'),
       (6, 'Physical Therapist'),
       (7, 'Administrative Staff'),
       (8, 'Billing Specialist');

SELECT setval(pg_get_serial_sequence('worker_type', 'id'), (SELECT MAX(id) FROM worker_type));

-- Insert sample workers (volunteers) for company id 1 (clinic)
INSERT INTO worker (id, first_name, last_name, email, phone_number, company_id, worker_type_id)
VALUES (1, 'Jennifer', 'Davis', 'jennifer.davis@clinic.com', '(555) 234-5601', 1, 1),
       (2, 'Robert', 'Miller', 'robert.miller@clinic.com', '(555) 234-5602', 1, 2),
       (3, 'Jessica', 'Wilson', 'jessica.wilson@clinic.com', '(555) 234-5603', 1, 3),
       (4, 'Christopher', 'Moore', 'christopher.moore@clinic.com', '(555) 234-5604', 1, 4),
       (5, 'Amanda', 'Taylor', 'amanda.taylor@clinic.com', '(555) 234-5605', 1, 5),
       (6, 'Matthew', 'Anderson', 'matthew.anderson@clinic.com', '(555) 234-5606', 1, 6),
       (7, 'Ashley', 'Thomas', 'ashley.thomas@clinic.com', '(555) 234-5607', 1, 7),
       (8, 'Daniel', 'Jackson', 'daniel.jackson@clinic.com', '(555) 234-5608', 1, 8);

SELECT setval(pg_get_serial_sequence('worker', 'id'), (SELECT MAX(id) FROM worker));


