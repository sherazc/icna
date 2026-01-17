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
INSERT INTO worker (id, first_name, last_name, company_id, worker_type_id)
VALUES (1, 'Jennifer', 'Davis', 1, 1),
       (2, 'Robert', 'Miller', 1, 2),
       (3, 'Jessica', 'Wilson', 1, 3),
       (4, 'Christopher', 'Moore', 1, 4),
       (5, 'Amanda', 'Taylor', 1, 5),
       (6, 'Matthew', 'Anderson', 1, 6),
       (7, 'Ashley', 'Thomas', 1, 7),
       (8, 'Daniel', 'Jackson', 1, 8);

SELECT setval(pg_get_serial_sequence('worker', 'id'), (SELECT MAX(id) FROM worker));


