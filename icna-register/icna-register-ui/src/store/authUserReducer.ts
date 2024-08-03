import {AuthUser} from "./context";
import {touchString} from "../service/utilities";

export enum ActionNameAuthUser {
    authUserLogin = "AUTH_USER_LOGIN",
    authUserLogout = "AUTH_USER_LOGOUT"
}

type ActionPayload = AuthUser;

export type AuthUserAction = {
    type: ActionNameAuthUser;
    payload?: ActionPayload;
}

export const authUserReducer = (authUser: AuthUser, action: AuthUserAction): AuthUser => {
    switch (action.type) {
        case ActionNameAuthUser.authUserLogin:
            return {
                userName: touchString(action.payload?.userName),
                authToken: touchString(action.payload?.authToken),
                roles: action.payload?.roles ? action.payload.roles : []
            }
        case ActionNameAuthUser.authUserLogout:
            return {userName: "", authToken: "", roles: []};
        default:
            return authUser;
    }
}

