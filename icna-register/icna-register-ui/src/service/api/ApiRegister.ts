import {
    addHeadersInRequest,
    ApiHeaders,
    ApiRequest,
    callApiIntercept,
    InterceptorCallBacks
} from "./ApiCore";
import {EventDto} from "../service-types";

/**
 * This method creates all the available endpoints.
 * @param baseUrl
 */
export const registerEndpoints = (baseUrl: string) => {
    return {
        epEvent: (eventId: string) => `${baseUrl}/api/events/${eventId}`,
    }
}


/**
 * Setup all ICNA Register endpoints.
 */
export const cdbApis = (baseUrl: string, commonHeaders?: ApiHeaders, interceptorCbs?: InterceptorCallBacks) => {

    const endpoints = registerEndpoints(baseUrl);

    const api = {
        apiConfigurations: (eventId: string): Promise<EventDto> => {
            const endpoint = endpoints.epEvent(eventId);
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        }
    }
    return api;
}
