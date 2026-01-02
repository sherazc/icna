import {type ClinicApisType} from "../service/service-types";
import {clinicApis} from "../service/api/ApiClinic";

export enum ActionNameClinicApis {
    updateClinicApis = "UPDATE_CLINIC_APIS"
}

type ActionPayload = ClinicApisType;

export type ClinicApisAction = {
    type: ActionNameClinicApis;
    payload?: ActionPayload;
}

export const clinicApisReducer = (regApis: ClinicApisType, action: ClinicApisAction): ClinicApisType => {
    switch (action.type) {
        case ActionNameClinicApis.updateClinicApis:
            return action.payload ? action.payload : clinicApis();
        default:
            return regApis;
    }
}
