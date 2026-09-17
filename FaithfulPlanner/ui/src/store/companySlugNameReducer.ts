import { defaultCompanyDto, type CompanyDto } from "../service/service-types";

export enum ActionNameCompanySlugName {
    companySlugNameUrl = "companySlugNameLogin",
}

type ActionPayload = CompanyDto;

export type CompanySlugNameAction = {
    type: ActionNameCompanySlugName;
    payload?: ActionPayload;
}

export const companySlugNameReducer = (companySlugName: CompanyDto, action: CompanySlugNameAction): CompanyDto => {
    switch (action.type) {
        case ActionNameCompanySlugName.companySlugNameUrl: {
            return action.payload ? action.payload : defaultCompanyDto();
        }
        default:
            return companySlugName;
    }
}
