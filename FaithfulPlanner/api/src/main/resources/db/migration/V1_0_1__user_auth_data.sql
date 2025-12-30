-- Insert 3 companies (Muslim clinics) with explicit IDs
INSERT INTO company (id, company_name, active)
VALUES
    (1, 'Al-Shifa Health Clinic', true),
    (2, 'Rahma Medical Center', true),
    (3, 'Barakah Community Clinic', true);

-- Insert 3 roles with explicit IDs
INSERT INTO user_role (id, role_name)
VALUES
    (1, 'MASTER'),
    (2, 'ADMIN'),
    (3, 'BASIC_USER');

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
