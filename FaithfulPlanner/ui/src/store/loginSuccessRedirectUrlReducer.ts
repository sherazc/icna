import { touchString } from "../service/utilities";

export enum ActionNameLoginSuccessRedirectUrl {
    loginSuccessRedirectUrlSet = "loginSuccessRedirectUrlSet",
    loginSuccessRedirectUrlRemove = "loginSuccessRedirectUrlRemove"
}

type ActionPayload = string;

export type LoginSuccessRedirectUrlAction = {
    type: ActionNameLoginSuccessRedirectUrl;
    payload?: ActionPayload;
}

export const loginSuccessRedirectUrlReducer = (loginSuccessRedirectUrl: string, action: LoginSuccessRedirectUrlAction): string => {
    switch (action.type) {
        case ActionNameLoginSuccessRedirectUrl.loginSuccessRedirectUrlSet: {
            return touchString(action.payload);
        }
        case ActionNameLoginSuccessRedirectUrl.loginSuccessRedirectUrlRemove: {
            return "";
        }
        default:
            return loginSuccessRedirectUrl;
    }
}
