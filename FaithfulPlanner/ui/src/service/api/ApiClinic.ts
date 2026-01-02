import type { Company } from "../service-types";
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
    }
    return api;
}

