-- Insert 3 companies (Muslim clinics)
INSERT INTO company (company_name, active, enable_monetization, enable_group_registration, enable_start_end_date)
VALUES
    ('Al-Shifa Health Clinic', true, true, true, true),
    ('Rahma Medical Center', true, true, false, true),
    ('Barakah Community Clinic', true, false, true, false);

-- Insert 3 roles
INSERT INTO user_role (role_name)
VALUES
    ('ADMIN'),
    ('ASSISTANT'),
    ('BASIC_USER');

-- Insert users for Al-Shifa Health Clinic (company_id = 1)
INSERT INTO user_profile (email, user_password, company_id)
VALUES
    ('sheraz@alshifa.com', 'password123', 1),      -- ADMIN
    ('tariq@alshifa.com', 'password123', 1),       -- ASSISTANT
    ('chaudhry@alshifa.com', 'password123', 1);    -- BASIC_USER

-- Insert users for Rahma Medical Center (company_id = 2)
INSERT INTO user_profile (email, user_password, company_id)
VALUES
    ('abrar@rahma.com', 'password123', 2),         -- ADMIN
    ('faraz@rahma.com', 'password123', 2),         -- ASSISTANT
    ('sheraz@rahma.com', 'password123', 2);        -- BASIC_USER

-- Insert users for Barakah Community Clinic (company_id = 3)
INSERT INTO user_profile (email, user_password, company_id)
VALUES
    ('tariq@barakah.com', 'password123', 3),       -- ADMIN
    ('chaudhry@barakah.com', 'password123', 3),    -- ASSISTANT
    ('abrar@barakah.com', 'password123', 3);       -- BASIC_USER

-- Assign roles to Al-Shifa Health Clinic users
INSERT INTO m2m_user_profile_user_role (user_profile_id, user_role_id)
VALUES
    (1, 1),  -- Sheraz - ADMIN
    (2, 2),  -- Tariq - ASSISTANT
    (3, 3);  -- Chaudhry - BASIC_USER

-- Assign roles to Rahma Medical Center users
INSERT INTO m2m_user_profile_user_role (user_profile_id, user_role_id)
VALUES
    (4, 1),  -- Abrar - ADMIN
    (5, 2),  -- Faraz - ASSISTANT
    (6, 3);  -- Sheraz - BASIC_USER

-- Assign roles to Barakah Community Clinic users
INSERT INTO m2m_user_profile_user_role (user_profile_id, user_role_id)
VALUES
    (7, 1),  -- Tariq - ADMIN
    (8, 2),  -- Chaudhry - ASSISTANT
    (9, 3);  -- Abrar - BASIC_USER

