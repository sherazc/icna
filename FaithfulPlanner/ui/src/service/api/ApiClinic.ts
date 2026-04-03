import type { AuthUserTokenDto, Company, EmployeeGroupDto, EmployeeGroupTypesDto, LoginRequest, OpDayDetailDto, OperationDayDto, RegistrationDto, ScheduleDto, UserProfileDto } from "../service-types";
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
    epGetEmployeeGroups: (companyId: number) => `${baseUrl}/api/company/${companyId}/employee-group`,
    epGetEmployeeGroup: (companyId: number, groupId: number) => `${baseUrl}/api/company/${companyId}/employee-group/${groupId}`,
    epEmployeeGroupTypes: (companyId: number, groupId: number) => `${baseUrl}/api/company/${companyId}/employee-group/${groupId}/types`,
    epCountEmployeeGroups: (companyId: number) => `${baseUrl}/api/company/${companyId}/employee-group/count`,
    epEmployeeGroupsTypes: (companyId: number) => `${baseUrl}/api/company/${companyId}/employee-group/types`,
    epUserProfile: (companyId: number, userProfileId: number) => `${baseUrl}/api/company/${companyId}/user-profile/${userProfileId}`,
    epUserProfileEmployeeTypes: (companyId: number, groupId: number) => `${baseUrl}/api/company/${companyId}/user-profile/group/${groupId}`,
    epHasUsersInGroup: (companyId: number, groupId: number) => `${baseUrl}/api/company/${companyId}/user-profile/group/${groupId}/has-users`,
    epUsersScheduled: (companyId: number, groupId: number, operationDayId: number, scheduled: boolean) =>
      `${baseUrl}/api/company/${companyId}/user-profile/group/${groupId}/operation-day/${operationDayId}?scheduled=${scheduled}`,
    epOperationDaySearch: (companyId: number) => `${baseUrl}/api/company/${companyId}/operation-day/search`,
    epOperationDay: (companyId: number, operationDayId: number) => `${baseUrl}/api/company/${companyId}/operation-day/${operationDayId}`,
    epOperationDays: (companyId: number) => `${baseUrl}/api/company/${companyId}/operation-day`,
    epOpDayDetail: (companyId: number) => `${baseUrl}/api/company/${companyId}/operation-day-detail`,
    epSchedule: () => `${baseUrl}/api/schedule`,
  }
}

export const clinicApis = (commonHeaders?: ApiHeaders, interceptorCbs?: InterceptorCallBacks) => {
  const endpoints = clinicEndpoints();
  const api = {
    getAllCompanies: (): Promise<Company[]> => {
      const endpoint = endpoints.epCompany();
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    login: (loginRequest: LoginRequest): Promise<AuthUserTokenDto> => {
      const endpoint = endpoints.epLoginToken();
      const request: ApiRequest = { endpoint };

      const encodedUserPassword =
        btoa(`${loginRequest.companyId}/${loginRequest.email}:${loginRequest.userPassword}`);

      const authenticationHeaders: ApiHeaders = [["Authorization", `Basic ${encodedUserPassword}`]];
      // Removed because it adds Bearer Authorization header
      // addHeadersInRequest(request, commonHeaders);
      addHeadersInRequest(request, authenticationHeaders);

      return callApiIntercept(request, interceptorCbs);
    },
    saveRegistration: (registrationDto: RegistrationDto): Promise<RegistrationDto> => {
      const endpoint = endpoints.epSaveRegistration();
      const request: ApiRequest = {
        endpoint,
        method: "PUT",
        payload: registrationDto,
        headers: CONTENT_JSON_HEADER()
      };
      // addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    getEmployeeGroupsTypes: (companyId: number): Promise<EmployeeGroupTypesDto[]> => {
      const endpoint = endpoints.epEmployeeGroupsTypes(companyId);
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    saveEmployeeGroupsTypes: (companyId: number, employeeGroupsTypes: EmployeeGroupTypesDto[]): Promise<EmployeeGroupTypesDto[]> => {
      const endpoint = endpoints.epEmployeeGroupsTypes(companyId);
      const request: ApiRequest = {
        endpoint,
        method: "POST",
        payload: employeeGroupsTypes,
        headers: CONTENT_JSON_HEADER()
      };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    countEmployeeGroups: (companyId: number): Promise<number> => {
      const endpoint = endpoints.epCountEmployeeGroups(companyId);
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    getEmployeeGroups: (companyId: number): Promise<EmployeeGroupDto[]> => {
      const endpoint = endpoints.epGetEmployeeGroups(companyId);
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    getEmployeeGroup: (companyId: number, groupId: number): Promise<EmployeeGroupDto> => {
      const endpoint = endpoints.epGetEmployeeGroup(companyId, groupId);
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    getEmployeeGroupTypes: (companyId: number, groupId: number): Promise<EmployeeGroupTypesDto> => {
      const endpoint = endpoints.epEmployeeGroupTypes(companyId, groupId);
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    getUserProfileEmployeeTypes: (companyId: number, groupId: number): Promise<UserProfileDto[]> => {
      const endpoint = endpoints.epUserProfileEmployeeTypes(companyId, groupId);
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    saveUserProfileEmployeeTypes: (companyId: number, groupId: number, user: UserProfileDto): Promise<UserProfileDto> => {
      const endpoint = endpoints.epUserProfileEmployeeTypes(companyId, groupId);
      const request: ApiRequest = {
        endpoint, method: "POST",
        payload: user,
        headers: CONTENT_JSON_HEADER()
      };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    hasUsersInGroup: (companyId: number, groupId: number): Promise<boolean> => {
      const endpoint = endpoints.epHasUsersInGroup(companyId, groupId);
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    deleteUserProfile: (companyId: number, userProfileId: number): Promise<string> => {
      const endpoint = endpoints.epUserProfile(companyId, userProfileId);
      const request: ApiRequest = { endpoint, method: "DELETE" };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    operationDaySave: (companyId: number, operationDayDto: OperationDayDto): Promise<OperationDayDto> => {
      const endpoint = endpoints.epOperationDays(companyId);
      const request: ApiRequest = {
        endpoint,
        method: "POST",
        payload: operationDayDto,
        headers: CONTENT_JSON_HEADER()
      };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    operationDayAll: (companyId: number): Promise<OperationDayDto[]> => {
      const endpoint = endpoints.epOperationDays(companyId);
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    operationDayDelete: (companyId: number, operationId: number): Promise<boolean> => {
      const endpoint = endpoints.epOperationDay(companyId, operationId);
      const request: ApiRequest = { endpoint, method: "DELETE" };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    operationDayFind: (companyId: number, serviceDateString: string): Promise<OperationDayDto[]> => {
      let endpoint = endpoints.epOperationDays(companyId);
      endpoint = `${endpoint}?date-string=${serviceDateString}`
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    opDayDetailFind: (companyId: number, beforeDateIso?: string, afterDateIso?: string): Promise<OpDayDetailDto[]> => {
      let endpoint = endpoints.epOpDayDetail(companyId);
      const params = new URLSearchParams();

      if (afterDateIso) {
        params.append('after', afterDateIso);
      }
      if (beforeDateIso) {
        params.append('before', beforeDateIso);
      }

      const queryString = params.toString();
      endpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    opDayDetailGet: (companyId: number, operationDayId: number): Promise<OpDayDetailDto> => {
      let endpoint = endpoints.epOpDayDetail(companyId);
      endpoint = `${endpoint}/${operationDayId}`
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    usersScheduled: (companyId: number, groupId: number, operationDayId: number, scheduled: boolean): Promise<UserProfileDto[]> => {
      const endpoint = endpoints.epUsersScheduled(companyId, groupId, operationDayId, scheduled);
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    scheduleUser: (schedule: ScheduleDto): Promise<ScheduleDto> => {
      const endpoint = endpoints.epSchedule();
      const request: ApiRequest = {
        endpoint,
        method: "POST",
        payload: schedule,
        headers: CONTENT_JSON_HEADER()
      };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    unscheduleUser: (operationDayId: number, userProfileId: number): Promise<boolean> => {
      let endpoint = endpoints.epSchedule();
      endpoint = `${endpoint}/operation-day/${operationDayId}/user-profile/${userProfileId}`
      const request: ApiRequest = { endpoint, method: "DELETE" };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
  };
  return api;
}


export const createAuthHeader = (authUserTokenDto: AuthUserTokenDto): ApiHeaders => ([[
  "Authorization", `Bearer ${authUserTokenDto.token}`
]]);

