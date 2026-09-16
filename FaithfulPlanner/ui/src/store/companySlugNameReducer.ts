import { defaultCompanyDto, type CompanyDto } from "../service/service-types";

export enum ActionNameCompanySlugName {
    companySlugName = "companySlugNameLogin",
}

type ActionPayload = CompanyDto;

export type CompanySlugNameAction = {
    type: ActionNameCompanySlugName;
    payload?: ActionPayload;
}

export const companySlugNameReducer = (companySlugName: CompanyDto, action: CompanySlugNameAction): CompanyDto => {
    switch (action.type) {
        case ActionNameCompanySlugName.companySlugName: {
            return action.payload ? action.payload : defaultCompanyDto();
        }
        default:
            return companySlugName;
    }
}
