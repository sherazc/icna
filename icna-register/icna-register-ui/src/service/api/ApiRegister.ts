import {
    addHeadersInRequest,
    ApiHeaders,
    ApiRequest,
    callApiIntercept,
    InterceptorCallBacks
} from "./ApiCore";
import {
    AttendeeDto, AuthUserTokenDto,
    EventDto, EventProgramDto, LoginRequest, RegistrationDto, StyleVariable
} from "../service-types";

export const baseUrl = process.env.REACT_APP_API_BASE_PATH;

/**
 * This method creates all the available endpoints.
 */
export const registerEndpoints = () => {
    return {
        epEvent: (eventId: string) => `${baseUrl}/api/events/id/${eventId}`,
        epFindProgramsByEventId: (eventId: string) => `${baseUrl}/api/programs/eventId/${eventId}`,
        epAttendeeByEventId: (eventId: string) => `${baseUrl}/api/attendees/eventId/${eventId}`,
        epFindAttendeeByAttendeeId: (attendeeId: string) => `${baseUrl}/api/attendees/id/${attendeeId}`,
        epFindAttendeeByEventIdAndRegistrationId: (eventId: string, registrationId: string) => `${baseUrl}/api/attendees/eventId/${eventId}/registrationId/${registrationId}`,
        epFindRegistrationByRegistrationId: (registrationId: string) => `${baseUrl}/api/registrations/${registrationId}`,
        epSaveRegistration: (eventId: string) => `${baseUrl}/api/registrations/eventId/${eventId}`,
        epFindStyleVariablesByEventId: (eventId: string) => `${baseUrl}/api/styles/variables/eventId/${eventId}`,
        epLoginToken: () => `${baseUrl}/api/login/token`

    }
}

/**
 * Setup all ICNA Register endpoints.
 *
 * TODO: create and export instead of creating it different places.
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
        findAttendeeByEventIdAndRegistrationId: (eventId: string, registrationId: string): Promise<AttendeeDto[]> => {
            const endpoint = endpoints.epFindAttendeeByEventIdAndRegistrationId(eventId, registrationId);
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        },
        findRegistrationByRegistrationId: (registrationId: string): Promise<RegistrationDto> => {
            const endpoint = endpoints.epFindRegistrationByRegistrationId(registrationId);
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        },
        findAttendeeByAttendeeId: (attendeeId: string): Promise<AttendeeDto> => {
            const endpoint = endpoints.epFindAttendeeByAttendeeId(attendeeId);
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        },
        findProgramsByEventId: (eventId: string): Promise<EventProgramDto[]> => {
            const endpoint = endpoints.epFindProgramsByEventId(eventId);
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        },
        saveRegistration: (eventId: string, registrationDto:RegistrationDto): Promise<RegistrationDto> => {
            const endpoint = endpoints.epSaveRegistration(eventId);
            const request: ApiRequest = {
                endpoint,
                method: "POST",
                payload: registrationDto,
                headers:[["Content-Type", "application/json"]]
            };
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        },
        findStyleVariablesByEventId: (eventId: string): Promise<StyleVariable[]> => {
            const endpoint = endpoints.epFindStyleVariablesByEventId(eventId);
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        },
        login: (loginRequest: LoginRequest): Promise<AuthUserTokenDto> => {
            const endpoint = endpoints.epLoginToken();
            const request: ApiRequest = {endpoint};

            const encodedUserPassword =
                btoa(`${loginRequest.eventId}/${loginRequest.email}:${loginRequest.userPassword}`);

            const authenticationHeaders: ApiHeaders = [["Authorization", `Basic ${encodedUserPassword}`]];

            addHeadersInRequest(request, commonHeaders);
            addHeadersInRequest(request, authenticationHeaders);

            return callApiIntercept(request, interceptorCbs);
        }
    }
    return api;
}
