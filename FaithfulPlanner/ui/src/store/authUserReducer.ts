import {type AuthUserTokenDto, defaultAuthUserTokenDto} from "../service/service-types";
import {saveAuthUserToken, clearAuthUserToken} from "../service/token-storage";

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
        case ActionNameAuthUser.authUserLogin: {
            const authUserTokenDto = action.payload ? action.payload : defaultAuthUserTokenDto();
            saveAuthUserToken(authUserTokenDto);
            return authUserTokenDto;
        }
        case ActionNameAuthUser.authUserLogout:
            clearAuthUserToken();
            return defaultAuthUserTokenDto();
        default:
            return authUser;
    }
}
