alter table company
    add column slug_name varchar(255);

alter table company
    add constraint uk_company_slug_name unique (slug_name);
