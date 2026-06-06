create table m2m_operation_day_employee_type
(
    operation_day_id bigint not null,
    employee_type_id bigint not null,
    primary key (operation_day_id, employee_type_id),
    constraint fk_op_day_emp_type_op_day foreign key (operation_day_id) references operation_day (id),
    constraint fk_op_day_emp_type_emp_type foreign key (employee_type_id) references employee_type (id)
);

create index idx_m2m_operation_day_employee_type_op_day on m2m_operation_day_employee_type (operation_day_id);
create index idx_m2m_operation_day_employee_type_emp_type on m2m_operation_day_employee_type (employee_type_id);
