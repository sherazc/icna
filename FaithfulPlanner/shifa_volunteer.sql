-- Volunteer users for company_id=1 (employee_group_id=2 = VOLUNTEER), assigned user_role_id=3 (BASIC_USER)
-- Source: shifa_volunteer.csv (57 rows inserted, 1 skipped)
-- Uses a data-modifying CTE (RETURNING) to link the newly generated user_profile ids to m2m_user_profile_user_role
-- without needing explicit ids on the user_profile insert.
-- Skipped duplicate email: Charu Kshirsagar <kc1232111@gmail.com> (already used by another row; violates uk_user_profile_email_company)

WITH inserted_volunteers AS (
    INSERT INTO user_profile (email, user_password, first_name, last_name, phone_number, company_id, employee_group_id)
    VALUES
    ('fardiniahmed@hotmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Fardin', 'Ahmed', '7063082533', 1, 2),
    ('javeriaarfan2@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Javeria', 'Arfan', '6787609489', 1, 2),
    ('yusuf.barodawala@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Yusuf', 'Barodawala', '7702354990', 1, 2),
    ('nawalberhanu4@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Nawal', 'Berhanu', '4704162244', 1, 2),
    ('natalie.bondu@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Natalie', 'Bondulich', '6783729120', 1, 2),
    ('saraelizabethbrown04@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Sara', 'Brown', '6785581316', 1, 2),
    ('aleehafaraz@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Aleeha', 'Chaudhry', '4049668855', 1, 2),
    ('kc1232111@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Khizra', 'Chaudhry', '4049555955', 1, 2),
    ('hoqueerida@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Rida', 'Hoque', '4049030230', 1, 2),
    ('nehajayleaf@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Neha', 'Jain', '6515002235', 1, 2),
    ('nimra.khan1@gatech.edu', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Nimra', 'Khan', '6783539959', 1, 2),
    ('nashra6866@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Nashra', 'Khan', '4044349727', 1, 2),
    ('sanglee1214@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Sang', 'Lee', '7064420793', 1, 2),
    ('rgmendo@emory.edu', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Rigo', 'Mendoza', '4323079908', 1, 2),
    ('iayaannabi@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Ayaan', 'Nabi', '6783574629', 1, 2),
    ('baasim.nabi@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Baasim', 'Nabi', '6789103571', 1, 2),
    ('paltaceylin38@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Ceylin', 'Palta', '4705561045', 1, 2),
    ('areelqureshi5@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Areel', 'Qureshi', '9144918712', 1, 2),
    ('puja.j.raol@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Puja', 'Raol', '6785980323', 1, 2),
    ('dreenassaeid@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Enas', 'Saied', '4703310444', 1, 2),
    ('haneenshah7@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Haneen', 'Shah', '7705601464', 1, 2),
    ('rayyanshareef007@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Rayyan', 'Shareef', '6788154249', 1, 2),
    ('shayan.siddiqi1950d@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Shayan', 'Siddiqi', '4704335593', 1, 2),
    ('rayyan5972@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Rayyan', 'Syed', '4047297204', 1, 2),
    ('mouzen.zabalawi10@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Mouzen', 'Zabalawi', '4049013720', 1, 2),
    ('electricejaz@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Ejaz', 'Haider Zaidi', '2562307206', 1, 2),
    ('calvinzhu678@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Calvin', 'Zhu', '6787587261', 1, 2),
    ('naeemaqureshi2005@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Naeema', 'Qureshi', '4705253132', 1, 2),
    ('aakritidkc@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Aakriti', 'KC', '(678) 907-3158', 1, 2),
    ('muneezaachaudhry@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Muneeza', 'Chaudhry', '(678) 365-1982', 1, 2),
    ('salmasarhan33@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Salma', 'Sarhan', '470-596-7812', 1, 2),
    ('aleenakhais@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Aleena', 'Khais', '6789204978', 1, 2),
    ('mykellerm@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Mykelle Rio Madeline', 'Labaguis', '4049017001', 1, 2),
    ('faiyaznaquib@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Faiyaz', 'Hoque', '7064499889', 1, 2),
    ('kalp.soni@emory.edu', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Kalp', 'Soni', '978-631-9174', 1, 2),
    ('duasheikh5505@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Dua', 'Sheikh', '8653401176', 1, 2),
    ('catherinekong.2503@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Catherine', 'Kong', '678-545-5986', 1, 2),
    ('parisharahman2002@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Parisha', 'Rahman', '6363995331', 1, 2),
    ('amal.panjwani@emory.edu', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Amal', 'Panjwani', '901-800-7139', 1, 2),
    ('jjyao2@emory.edu', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Joanna', 'Yao', '862-283-9420', 1, 2),
    ('mabulaila86@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Mohammad', 'Abu Leila', '6782318555', 1, 2),
    ('19marondo@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Mariyah', 'Rondo', '2168552061', 1, 2),
    ('najamarobow@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Najama', 'Robow', '7623900447', 1, 2),
    ('ss41769@uga.edu', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Samiha', 'Sarwar', '6783088224', 1, 2),
    ('ashaikh80@gatech.edu', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Aneesah', 'Shaikh', '7702689094', 1, 2),
    ('nusrathcrashid444@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Nusrath', 'Chowdhury', '404-493-7359', 1, 2),
    ('jennah.elhaj07@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Jennah', 'Elhaj', '4702480001', 1, 2),
    ('ssmakkar1030@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Sahejveer', 'Makkar', '404-747-4363', 1, 2),
    ('tamie44442@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Amie', 'Tamba', '2294174188', 1, 2),
    ('habsamohamed1119@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Habsa', 'Mohamed', '4702636232', 1, 2),
    ('sulaiman.ilyas1010@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Sulaiman', 'Ilyas', '770-906-7206', 1, 2),
    ('adanmisky39@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Misky', 'Adan', '949-275-3604', 1, 2),
    ('Hindsahraoui.01@icloud.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Hind', 'Sahraoui', '4045529465', 1, 2),
    ('mah.abdelfattah92@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Mahmoud', 'Abdelfattah', '4706593526', 1, 2),
    ('amrkhaled1377@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Amr', 'Abdelkawy', '470-606-1480', 1, 2),
    ('aminah0306@icloud.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Aminah', 'Aleem', '4703581378', 1, 2),
    ('Alischoolacc375@gmail.com', '$2a$10$goMYDO9waPIXLeaekcuo3.3tQ54zIaZ8RWjbAVl.UC.BxI16hAKOC', 'Ali', 'Ahmed', '678-622-8851', 1, 2)
    RETURNING id
)
INSERT INTO m2m_user_profile_user_role (user_profile_id, user_role_id)
SELECT id, 3 FROM inserted_volunteers;

