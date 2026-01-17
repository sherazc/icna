create table provider_type
(
    id        bigserial    not null primary key,
    type_name varchar(255) not null
);

create table provider
(
    id        bigserial    not null primary key,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    email varchar(255),
    phone_number varchar(50),
    company_id      bigint,
    provider_type_id bigint,
    constraint fk_provider_provider_type foreign key (provider_type_id) references provider_type(id),
    constraint fk_provider_company foreign key (company_id) references company(id)
);

INSERT INTO provider_type (id, type_name)
VALUES (1, 'General Practitioner'),
       (2, 'Pediatrician'),
       (3, 'Cardiologist'),
       (4, 'Dermatologist'),
       (5, 'Orthopedic Surgeon'),
       (6, 'Psychiatrist'),
       (7, 'Dentist'),
       (8, 'Ophthalmologist');

SELECT setval(pg_get_serial_sequence('provider_type', 'id'), (SELECT MAX(id) FROM provider_type));

-- Insert sample providers for company id 1 (clinic)
INSERT INTO provider (id, first_name, last_name, email, phone_number, company_id, provider_type_id)
VALUES (1, 'John', 'Smith', 'john.smith@clinic.com', '(555) 123-4501', 1, 1),
       (2, 'Sarah', 'Johnson', 'sarah.johnson@clinic.com', '(555) 123-4502', 1, 2),
       (3, 'Michael', 'Williams', 'michael.williams@clinic.com', '(555) 123-4503', 1, 3),
       (4, 'Emily', 'Brown', 'emily.brown@clinic.com', '(555) 123-4504', 1, 4),
       (5, 'David', 'Jones', 'david.jones@clinic.com', '(555) 123-4505', 1, 5);

SELECT setval(pg_get_serial_sequence('provider', 'id'), (SELECT MAX(id) FROM provider));

