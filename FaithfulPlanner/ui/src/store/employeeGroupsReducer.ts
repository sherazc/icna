import type { EmployeeGroupDto } from "../service/service-types";

export const enum ActionNameEmployeeGroup {
    setEmployeeGroups = 'SET_EMPLOYEE_GROUPS',    
};

export type EmployeeGroupAction = {
    type: ActionNameEmployeeGroup;
    payload: EmployeeGroupDto[];
};

export const employeeGroupReducer = (employeeGroupState: EmployeeGroupDto[], action: EmployeeGroupAction): EmployeeGroupDto[] => {
    switch (action.type) {
        case ActionNameEmployeeGroup.setEmployeeGroups :
            return action.payload
        default:
            return employeeGroupState;
    }
};
