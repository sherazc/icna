import type { AuthUserTokenDto, Company, EmployeeGroupDto, EmployeeGroupTypesDto, LoginRequest, RegistrationDto, UserProfileEmployeeTypesDto } from "../service-types";
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
    epGetEmployeeGroupTypes: (companyId: number, groupId: number) => `${baseUrl}/api/company/${companyId}/employee-group/${groupId}/types`,
    epCountEmployeeGroups: (companyId: number) => `${baseUrl}/api/company/${companyId}/employee-group/count`,
    epEmployeeGroupsTypes: (companyId: number) => `${baseUrl}/api/company/${companyId}/employee-group/types`,
    epUserProfileEmployeeTypes: (companyId: number, groupId: number) => `${baseUrl}/api/company/${companyId}/user-profile/group/${groupId}`,
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
      const endpoint = endpoints.epGetEmployeeGroupTypes(companyId, groupId);
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    getUserProfileEmployeeTypes: (companyId: number, groupId: number): Promise<UserProfileEmployeeTypesDto[]> => {
      const endpoint = endpoints.epUserProfileEmployeeTypes(companyId, groupId);
      const request: ApiRequest = { endpoint };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
    saveUserProfileEmployeeTypes: (companyId: number, groupId: number, userEmployeeTypes: UserProfileEmployeeTypesDto): Promise<UserProfileEmployeeTypesDto> => {
      const endpoint = endpoints.epUserProfileEmployeeTypes(companyId, groupId);
      const request: ApiRequest = { 
        endpoint, method: "POST",
        payload: userEmployeeTypes,
        headers: CONTENT_JSON_HEADER()
       };
      addHeadersInRequest(request, commonHeaders);
      return callApiIntercept(request, interceptorCbs);
    },
  }
  return api;
}


export const createAuthHeader = (authUserTokenDto: AuthUserTokenDto): ApiHeaders => ([[
  "Authorization", `Bearer ${authUserTokenDto.token}`
]]);

