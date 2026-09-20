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
            return loginSuccessRedirectUrl;
        } 
        case ActionNameLoginSuccessRedirectUrl.loginSuccessRedirectUrlRemove: {
            return "";
        }
        default:
            return loginSuccessRedirectUrl;
    }
}
