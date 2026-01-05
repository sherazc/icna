import type { AuthUserTokenDto, Company, LoginRequest, RegistrationDto } from "../service-types";
import {
    addHeadersInRequest,
    callApiIntercept,
    type ApiHeaders,
    type ApiRequest,
    type InterceptorCallBacks
} from "./ApiCore";

export const baseUrl = import.meta.env.VITE_API_BASE_PATH;

const CONTENT_JSON_HEADER = (): ApiHeaders => [["Content-Type", "application/json"]]

export const clinicEndpoints = () => {
    return {
        epCompany: () => `${baseUrl}/api/company`,
        epLoginToken: () => `${baseUrl}/api/login/token`,
        epSaveRegistration: () => `${baseUrl}/api/registration`,
    }
}

export const clinicApis = (commonHeaders?: ApiHeaders, interceptorCbs?: InterceptorCallBacks) => {
    const endpoints = clinicEndpoints();
    const api = {
        getAllCompanies: (): Promise<Company[]> => {
            const endpoint = endpoints.epCompany();
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        },
        login: (loginRequest: LoginRequest): Promise<AuthUserTokenDto> => {
            const endpoint = endpoints.epLoginToken();
            const request: ApiRequest = {endpoint};

            const encodedUserPassword =
                btoa(`${loginRequest.companyId}/${loginRequest.email}:${loginRequest.userPassword}`);

            const authenticationHeaders: ApiHeaders = [["Authorization", `Basic ${encodedUserPassword}`]];

            // Removed because it adds Bearer Authorization header
            // addHeadersInRequest(request, commonHeaders);
            addHeadersInRequest(request, authenticationHeaders);

            return callApiIntercept(request, interceptorCbs);
        },
        saveRegistration: (registrationDto:RegistrationDto): Promise<RegistrationDto> => {
            const endpoint = endpoints.epSaveRegistration();
            const request: ApiRequest = {
                endpoint,
                method: "PUT",
                payload: registrationDto,
                headers: CONTENT_JSON_HEADER()};
            // addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        },
    }
    return api;
}

