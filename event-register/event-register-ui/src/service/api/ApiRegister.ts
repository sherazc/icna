import {
    addHeadersInRequest,
    ApiHeaders,
    ApiRequest,
    callApiIntercept,
    InterceptorCallBacks
} from "./ApiCore";
import {
    AttendeeDto, AuthUserTokenDto,
    EventDto, EventProgramDto, FlagDto, LoginRequest, RegistrationDto, StyleVariable, UserProfileDto
} from "../service-types";
import {parseObjectsIsoDateToMdDate} from "../DateService";

export const baseUrl = process.env.REACT_APP_API_BASE_PATH;

/**
 * This method creates all the available endpoints.
 */
export const registerEndpoints = () => {
    return {
        epEvent: (eventId: string) => `${baseUrl}/api/events/id/${eventId}`,
        epEventFutureActive: () => `${baseUrl}/api/events/future/active`,
        epFindProgramsByEventId: (eventId: string) => `${baseUrl}/api/programs/eventId/${eventId}`,
        epAttendeeByEventId: (eventId: string) => `${baseUrl}/api/attendees/eventId/${eventId}`,
        epFindAttendeeByAttendeeId: (attendeeId: string) => `${baseUrl}/api/attendees/id/${attendeeId}`,
        epFindAttendeeByEventIdAndRegistrationId: (eventId: string, registrationId: string) => `${baseUrl}/api/attendees/eventId/${eventId}/registrationId/${registrationId}`,
        epFindRegistrationByRegistrationId: (registrationId: string) => `${baseUrl}/api/registrations/${registrationId}`,
        epFindRegistrationByUserProfileId: (userProfileId: string) => `${baseUrl}/api/registrations/user-profile/${userProfileId}`,
        epSaveRegistration: (eventId: string) => `${baseUrl}/api/registrations/eventId/${eventId}`,
        epGetDefaultVariables: () => `${baseUrl}/api/styles/variables/default`,
        epFindStyleVariablesAllByEventId: (eventId: string) => `${baseUrl}/api/styles/variables/eventId/${eventId}`,
        epFindStyleVariablesCustomByEventId: (eventId: string) => `${baseUrl}/api/styles/variables/custom/eventId/${eventId}`,
        epLoginToken: () => `${baseUrl}/api/login/token`,
        epGetUserProfile: (userProfileId: string) => `${baseUrl}/api/user-profile/${userProfileId}`,
        epFindUserProfile: (eventId: string, email: string) => `${baseUrl}/api/user-profile/find?eventId=${eventId}&userEmail=${email}`,
        epIsEmailExist: (eventId: string, email: string) => `${baseUrl}/api/user-profile/email/exists?eventId=${eventId}&userEmail=${email}`,
        epFindEventAdmin: (eventId: string) => `${baseUrl}/api/user-profile/event/${eventId}/admin`,
    }
}

/**
 * Setup all EVENT Register endpoints.
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
            const interceptors = addMdDateParserInterceptor(interceptorCbs);
            return callApiIntercept(request, interceptors);
        },
        eventFutureActive: (): Promise<EventDto[]> => {
            const endpoint = endpoints.epEventFutureActive();
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            const interceptors = addMdDateParserInterceptor(interceptorCbs);
            return callApiIntercept(request, interceptors);
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
        findRegistrationByUserProfileId: (userProfileId: string): Promise<RegistrationDto> => {
            const endpoint = endpoints.epFindRegistrationByUserProfileId(userProfileId);
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
        getDefaultVariables: (): Promise<StyleVariable[]> => {
            const endpoint = endpoints.epGetDefaultVariables();
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        },
        findStyleVariablesByEventId: (eventId: string): Promise<StyleVariable[]> => {
            const endpoint = endpoints.epFindStyleVariablesAllByEventId(eventId);
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        },
        findStyleVariablesCustomByEventId: (eventId: string): Promise<StyleVariable[]> => {
            const endpoint = endpoints.epFindStyleVariablesCustomByEventId(eventId);
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
        },
        findUserProfile: (eventId: string, email: string): Promise<UserProfileDto> => {
            const endpoint = endpoints.epFindUserProfile(eventId, email);
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        },
        getUserProfile: (userProfileId: string): Promise<UserProfileDto> => {
            const endpoint = endpoints.epGetUserProfile(userProfileId);
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        },
        isEmailExist: (eventId: string, email: string): Promise<FlagDto> => {
            const endpoint = endpoints.epIsEmailExist(eventId, email);
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        },
        findEventAdmin: (eventId: string): Promise<UserProfileDto> => {
            const endpoint = endpoints.epFindEventAdmin(eventId);
            const request: ApiRequest = {endpoint};
            addHeadersInRequest(request, commonHeaders);
            return callApiIntercept(request, interceptorCbs);
        }


    }
    return api;
}

const addMdDateParserInterceptor = (interceptorCbs?: InterceptorCallBacks): InterceptorCallBacks => {
    let interceptor: InterceptorCallBacks = interceptorCbs ? interceptorCbs : {};
    interceptor.afterSuccess = interceptor.afterSuccess ? interceptor.afterSuccess : [];
    interceptor.afterError = interceptor.afterError ? interceptor.afterError : [];
    const containsParser = interceptor.afterSuccess.find(fn => fn == parseObjectsIsoDateToMdDate);
    if (!containsParser) {
        interceptor.afterSuccess.push(parseObjectsIsoDateToMdDate)
    }
    return interceptor;
}
