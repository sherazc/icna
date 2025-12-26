-- Insert 3 companies (Muslim clinics) with explicit IDs
INSERT INTO company (id, company_name, active, enable_monetization, enable_group_registration, enable_start_end_date)
VALUES
    (1, 'Al-Shifa Health Clinic', true),
    (2, 'Rahma Medical Center', true),
    (3, 'Barakah Community Clinic', true);

-- Insert 3 roles with explicit IDs
INSERT INTO user_role (id, role_name)
VALUES
    (1, 'ADMIN'),
    (2, 'ASSISTANT'),
    (3, 'BASIC_USER');

-- Insert users for Al-Shifa Health Clinic (company_id = 1) with explicit IDs
INSERT INTO user_profile (id, email, user_password, company_id)
VALUES
    (1, 'sheraz@alshifa.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 1),      -- ADMIN
    (2, 'tariq@alshifa.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 1),       -- ASSISTANT
    (3, 'chaudhry@alshifa.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 1);    -- BASIC_USER

-- Insert users for Rahma Medical Center (company_id = 2) with explicit IDs
INSERT INTO user_profile (id, email, user_password, company_id)
VALUES
    (4, 'abrar@rahma.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 2),         -- ADMIN
    (5, 'faraz@rahma.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 2),         -- ASSISTANT
    (6, 'sheraz@rahma.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 2);        -- BASIC_USER

-- Insert users for Barakah Community Clinic (company_id = 3) with explicit IDs
INSERT INTO user_profile (id, email, user_password, company_id)
VALUES
    (7, 'tariq@barakah.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 3),       -- ADMIN
    (8, 'chaudhry@barakah.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 3),    -- ASSISTANT
    (9, 'abrar@barakah.com', '$2a$10$AanlohWdKdZkyMMriaUvtupGR8WWUilrzT.SBesfo25jPYp2jOMUa', 3);       -- BASIC_USER

-- Assign roles to Al-Shifa Health Clinic users (all users get BASIC_USER + their primary role)
INSERT INTO m2m_user_profile_user_role (user_profile_id, user_role_id)
VALUES
    (1, 1),  -- Sheraz - ADMIN
    (1, 3),  -- Sheraz - BASIC_USER
    (2, 2),  -- Tariq - ASSISTANT
    (2, 3),  -- Tariq - BASIC_USER
    (3, 3);  -- Chaudhry - BASIC_USER

-- Assign roles to Rahma Medical Center users (all users get BASIC_USER + their primary role)
INSERT INTO m2m_user_profile_user_role (user_profile_id, user_role_id)
VALUES
    (4, 1),  -- Abrar - ADMIN
    (4, 3),  -- Abrar - BASIC_USER
    (5, 2),  -- Faraz - ASSISTANT
    (5, 3),  -- Faraz - BASIC_USER
    (6, 3);  -- Sheraz - BASIC_USER

-- Assign roles to Barakah Community Clinic users (all users get BASIC_USER + their primary role)
INSERT INTO m2m_user_profile_user_role (user_profile_id, user_role_id)
VALUES
    (7, 1),  -- Tariq - ADMIN
    (7, 3),  -- Tariq - BASIC_USER
    (8, 2),  -- Chaudhry - ASSISTANT
    (8, 3),  -- Chaudhry - BASIC_USER
    (9, 3);  -- Abrar - BASIC_USER

