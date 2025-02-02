import {RegisterApisType} from "../service/service-types";
import {registerApis} from "../service/api/ApiRegister";

export enum ActionNameRegisterApis {
    updateRegisterApis = "UPDATE_REGISTER_APIS"
}

type ActionPayload = RegisterApisType;

export type RegisterApisAction = {
    type: ActionNameRegisterApis;
    payload?: ActionPayload;
}

export const registerApisReducer = (regApis: RegisterApisType, action: RegisterApisAction): RegisterApisType => {
    switch (action.type) {
        case ActionNameRegisterApis.updateRegisterApis:
            return action.payload ? action.payload : registerApis();
        default:
            return regApis;
    }
}
