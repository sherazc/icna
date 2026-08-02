import type { Dispatch as ReactDispatch } from "react";
import type { ApiHeaders } from "./ApiCore";
import { registerUnauthorizedHandler } from "./ApiCore";
import { clinicApis, createAuthHeader } from "./ApiClinic";
import { loadAuthUserToken } from "../token-storage";
import type { AuthUserTokenDto } from "../service-types";
import { ActionNameAuthUser, type AuthUserAction } from "../../store/authUserReducer";
import { ActionNameClinicApis, type ClinicApisAction } from "../../store/clinicApisReducer";

type Dispatch = ReactDispatch<AuthUserAction | ClinicApisAction>;
type Navigate = (path: string) => void;

let dispatchFn: Dispatch | null = null;
let navigateFn: Navigate | null = null;
let refreshPromise: Promise<ApiHeaders> | null = null;

/**
 * Wires this module into the API layer's 401 hook and gives it access to
 * dispatch/navigate. Call once, from a component mounted inside both
 * AppProvider and BrowserRouter.
 */
export const initTokenRefreshCoordinator = (dispatch: Dispatch, navigate: Navigate): void => {
    dispatchFn = dispatch;
    navigateFn = navigate;
    registerUnauthorizedHandler(getRefreshedAuthHeader);
}

/**
 * Called by ApiCore on a 401. De-duplicates concurrent callers onto a single
 * in-flight refresh call, since refresh tokens rotate (single-use) and firing
 * more than one refresh at a time would revoke a token a sibling call still needs.
 */
const getRefreshedAuthHeader = (): Promise<ApiHeaders> => {
    const currentToken = loadAuthUserToken();

    if (!currentToken.refreshToken) {
        handleRefreshFailure();
        return Promise.reject("No refresh token available.");
    }

    if (!refreshPromise) {
        refreshPromise = clinicApis().refreshToken(currentToken.refreshToken)
            .then(authUserTokenDto => {
                handleRefreshSuccess(authUserTokenDto);
                return createAuthHeader(authUserTokenDto);
            })
            .catch(error => {
                handleRefreshFailure();
                throw error;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

const handleRefreshSuccess = (authUserTokenDto: AuthUserTokenDto): void => {
    dispatchFn?.({ type: ActionNameAuthUser.authUserLogin, payload: authUserTokenDto });
    dispatchFn?.({
        type: ActionNameClinicApis.updateClinicApis,
        payload: clinicApis(createAuthHeader(authUserTokenDto))
    });
}

const handleRefreshFailure = (): void => {
    dispatchFn?.({ type: ActionNameAuthUser.authUserLogout });
    dispatchFn?.({ type: ActionNameClinicApis.updateClinicApis });
    navigateFn?.("/");
}
