import { defaultCompanyDto, type CompanyDto } from "../service/service-types";

export enum ActionNameCompanySlugName {
    companySlugNameUrlSet = "companySlugNameSet",
    companySlugNameUrlRemove = "companySlugNameUrlRemove"
}

type ActionPayload = CompanyDto;

export type CompanySlugNameAction = {
    type: ActionNameCompanySlugName;
    payload?: ActionPayload;
}

export const companySlugNameReducer = (companySlugName: CompanyDto, action: CompanySlugNameAction): CompanyDto => {
    switch (action.type) {
        case ActionNameCompanySlugName.companySlugNameUrlSet: {
            return action.payload ? action.payload : defaultCompanyDto();
        } 
        case ActionNameCompanySlugName.companySlugNameUrlRemove: {
            return defaultCompanyDto();
        }
        default:
            return companySlugName;
    }
}
