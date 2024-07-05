import {
    addHeadersInRequest,
    ApiHeaders,
    ApiRequest,
    callApiIntercept,
    InterceptorCallBacks
} from "./ApiCore";
import {EventDto} from "../service-types";

export const baseUrl = process.env.REACT_APP_API_BASE_PATH;

/**
 * This method creates all the available endpoints.
 */
export const registerEndpoints = () => {

    return {
        epEvent: (eventId: string) => `${baseUrl}/api/events/id/${eventId}`,
    }
}

/**
 * Setup all ICNA Register endpoints.
 */
export const registerApis = (commonHeaders?: ApiHeaders, interceptorCbs?: InterceptorCallBacks) => {

    const endpoints = registerEndpoints();

    const api = {
        findEventById: (eventId: string): Promise<EventDto> => {
            const endpoint = endpoints.epEvent(eventId);
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        }
    }
    return api;
}
