import {
    type ApiHeaders,
    type InterceptorCallBacks
} from "./ApiCore";

export const baseUrl = import.meta.env.VITE_API_BASE_PATH;

const CONTENT_JSON_HEADER = (): ApiHeaders => [["Content-Type", "application/json"]]

export const registerEndpoints = () => {
    return {
        // epEvent: (eventId: string) => `${baseUrl}/api/events/id/${eventId}`,
    }
}

export const registerApis = (commonHeaders?: ApiHeaders, interceptorCbs?: InterceptorCallBacks) => {
    const endpoints = registerEndpoints();
    const api = {
    }
    return api;
}

