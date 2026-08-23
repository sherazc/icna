WITH inserted_providers AS (
    INSERT INTO user_profile (email, user_password, first_name, last_name, phone_number, company_id, employee_group_id)
    VALUES
    ('noor10793@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Noor', 'Al-Shibli', '225-614-6983', 6, 7),
    ('abrar@icna.org', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Abrar', 'Chaudhry', '404-432-5670', 6, 7),
    ('rfaiyaz@aol.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Rashid', 'Faiyaz', '937-344-9061', 6, 7),
    ('Dr_alavi@hotmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Sara', 'Alavi', '203-273-6758', 6, 7),
    ('nkhan125@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Noreen', 'Khan', '706-765-7168', 6, 7),
    ('qureshi.mohammed.m@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Mohammed', 'Qureshi', '281-702-7586', 6, 7),
    ('dr.sanarabbi@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Sana', 'Rabbi', '713-898-0155', 6, 7),
    ('caroline.reed@icnarelief.org', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Caroline', 'Reed', '703-582-3442', 6, 7),
    ('rrizvi7@yahoo.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Rukhsana', 'Rizvi', '404-291-9765', 6, 7),
    ('farheen.shirazi@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Farheen', 'Shirazi', '404-667-2099', 6, 7),
    ('sherif.g.nour@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Sherif', 'Nour Abdallah', '404-778-2650', 6, 7),
    ('syedshirazi2@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Syed', 'Shirazi', '404-210-3483', 6, 7),
    ('aliya_ghani@yahoo.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Aliya', 'Zia', '650-930-6723', 6, 7),
    ('Rachel.chapais@emoryhealthcare.org', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Rachel', 'Chapais', '207-607-2595', 6, 7),
    ('awsiff@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Meraj', 'Asif', '205-383-7787', 6, 7),
    ('hasansaiyed@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Hasan', 'Saiyed', '404-444-3132', 6, 7),
    ('mushtaqhq@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Mushtaq', 'Qureshi', '914-483-7972', 6, 7),
    ('jabbar.aysha@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Aysha', 'Jabbar', '972-467-2358', 6, 7),
    ('eklasmpac@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Eklas', 'Mohammed', '470-819-7031', 6, 7),
    ('shah.fauzia@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Fauzia', 'Shah', '770-605-0918', 6, 7),
    ('ayeshamd1@yahoo.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Ayesha', 'Khan', '919-272-2606', 6, 7),
    ('onyinyeokafor@yahoo.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Onyinye', 'Iheaku', '404-643-9814', 6, 7),
    ('hossain617@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Mohammad', 'Hossain', '615-268-6010', 6, 7),
    ('drokok123@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Omar', 'Khan', '917-796-7152', 6, 7),
    ('talhaijaz@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Talha', 'Ijaz', '404-630-3926', 6, 7),
    ('amina.nisar@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Amina', 'Nisar', '734-778-2457', 6, 7),
    ('farhanahmed.md@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Farhan', 'Ahmed', '404-388-9979', 6, 7),
    ('fjm7862001@yahoo.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Farhan', 'Malik', '410-908-5589', 6, 7)
    RETURNING id
)
INSERT INTO m2m_user_profile_user_role (user_profile_id, user_role_id)
SELECT id, 3 FROM inserted_providers;
