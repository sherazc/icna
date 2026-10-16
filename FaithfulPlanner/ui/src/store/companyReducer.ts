import type { CompanyDto } from "../service/service-types";

export const enum ActionNameCompanies {
    setCompanies = 'SET_COMPANIES',
    clearCompanies = 'CLEAR_COMPANIES'
}

export type CompaniesAction = {
    type: ActionNameCompanies;
    payload: CompanyDto[];
}

export const companiesReducer = (companiesState: CompanyDto[], action: CompaniesAction): CompanyDto[] => {
    switch (action.type) {
        case ActionNameCompanies.setCompanies :
            return action.payload
        case ActionNameCompanies.clearCompanies :
            return []
        default:
            return companiesState;
    }
}
