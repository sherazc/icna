import {
    addHeadersInRequest,
    ApiHeaders,
    ApiRequest,
    callApiIntercept,
    InterceptorCallBacks
} from "./ApiCore";
import {
    AttendeeDto,
    EventDto
} from "../service-types";

export const baseUrl = process.env.REACT_APP_API_BASE_PATH;

/**
 * This method creates all the available endpoints.
 */
export const registerEndpoints = () => {
    return {
        epEvent: (eventId: string) => `${baseUrl}/api/events/id/${eventId}`,
        epAttendeeByEventId: (eventId: string) => `${baseUrl}/api/attendees/eventId/${eventId}`,
        epFindAttendeeByAttendeeId: (attendeeId: string) => `${baseUrl}/api/attendees/id/${attendeeId}`,
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
        },
        findAttendeeByEventId: (eventId: string): Promise<AttendeeDto[]> => {
            const endpoint = endpoints.epAttendeeByEventId(eventId);
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        },
        findAttendeeByAttendeeId: (attendeeId: string): Promise<AttendeeDto> => {
            const endpoint = endpoints.epFindAttendeeByAttendeeId(attendeeId);
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        }


    }
    return api;
}
