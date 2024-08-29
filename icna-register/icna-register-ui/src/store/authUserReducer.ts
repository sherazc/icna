import {AuthUserTokenDto, defaultAuthUserTokenDto} from "../service/service-types";

export enum ActionNameAuthUser {
    authUserLogin = "AUTH_USER_LOGIN",
    authUserLogout = "AUTH_USER_LOGOUT"
}

type ActionPayload = AuthUserTokenDto;

export type AuthUserAction = {
    type: ActionNameAuthUser;
    payload?: ActionPayload;
}

export const authUserReducer = (authUser: AuthUserTokenDto, action: AuthUserAction): AuthUserTokenDto => {
    switch (action.type) {
        case ActionNameAuthUser.authUserLogin:
            return action.payload ? action.payload : defaultAuthUserTokenDto();
        case ActionNameAuthUser.authUserLogout:
            return defaultAuthUserTokenDto();
        default:
            return authUser;
    }
}
