import type { Company } from "../service/service-types";

export const enum ActionNameCompany {
    setCompanies = 'SET_COMPANIES',
    clearCompanies = 'CLEAR_COMPANIES'
}

export type CompanyAction = {
    type: ActionNameCompany;
    payload: Company[];
}

export const companyReducer = (companiesState: Company[], action: CompanyAction): Company[] => {
    switch (action.type) {
        case ActionNameCompany.setCompanies :
            return action.payload
        case ActionNameCompany.clearCompanies :
            return []
        default:
            return companiesState;
    }
}
