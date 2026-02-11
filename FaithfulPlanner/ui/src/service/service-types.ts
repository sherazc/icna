import type { clinicApis } from "./api/ApiClinic";
import { touchString } from "./utilities";

export type Company = {
    id?: number,
    companyName: string,
    active: boolean
};

export type LoginRequest = {
    companyId: string,
    email: string,
    userPassword?: string
};

export const defaultLoginRequest = (companyId?: string | undefined): LoginRequest => ({
    email: "",
    companyId: touchString(companyId),
    userPassword: ""
});

export type AuthUserTokenDto = {
    userProfileId: number;
    companyId: number;
    companyName: string,
    subject: string;
    issuedAtUtc: string;
    expiresAtUtc: string;
    roles: AuthRole[];
    token: string;
};

export type AuthRole = 'BASIC_USER' // Users who register for the event
    | 'ADMIN' // Users who work on the registration desk
    | 'MASTER' // Users who Manage Event
    ;

export const defaultAuthUserTokenDto = (): AuthUserTokenDto => ({
    userProfileId: 0,
    companyId: 0,
    companyName: "",
    subject: "",
    issuedAtUtc: "",
    expiresAtUtc: "",
    roles: [],
    token: ""
});

export type ClinicApisType = ReturnType<typeof clinicApis>;

export type RegistrationDto = {
    company: CompanyDto,
    userProfile: UserProfileDto
};

export const defaultRegistrationDto = (): RegistrationDto => ({
    company: defaultCompanyDto(),
    userProfile: defaultUserProfileDto()
});

export type CompanyDto = {
    id?: number,
    companyName: string,
    active?: boolean,
};

export const defaultCompanyDto = (): CompanyDto => ({
    companyName: "",
});

export type UserProfileDto = {
    id?: number,
    email: string,
    usersPassword?: string,
    companyId?: number
    firstName?: string,
    lastName?: string,
    phoneNumber?: string
};

export const defaultUserProfileDto = (): UserProfileDto => ({
    email: "",
});

export type ErrorDto = {
    field?: string;
    message?: string;
};

export type FormPassword = {
    passwordField: string;
    passwordConfirm: string;
};

export enum FormState {
    FRESH, IN_PROGRESS, SUCCESSFUL, FAILED
};

export type EmployeeGroupDto = {
    id?: number;
    groupName: string;
}
export const defaultEmployeeGroupDto  = (): EmployeeGroupDto => ({id: 0, groupName: ""})


/**
 * EmployeeGroupTypeDto extends EmployeeGroupDto.
 * 
 * This syntax '&' is called "TypeScript's intersection type"
 * 
 */
export type EmployeeGroupTypesDto = EmployeeGroupDto & {
    employeeTypes: EmployeeTypeDto[];
}
export const defaultEmployeeGroupTypeDto  = (): EmployeeGroupTypesDto => ({id: 0, groupName: "", employeeTypes: []})

export type EmployeeTypeDto = {
    id?: number;
    typeName: string;
}

export type UserProfileEmployeeTypesDto = UserProfileDto & {
    employeeTypes: EmployeeTypeDto[];
}
export const defaultUserProfileEmployeeTypesDto:UserProfileEmployeeTypesDto = {
    ...defaultUserProfileDto(), employeeTypes: []
}

export enum ModalType { DEFAULT, INFORMATION, WARNING, ERROR };

export type ModalConfig = {
  title?: string,
  yesFunction?: () => void,
  yesLabel?: string
  noFunction?: () => void,
  noLabel?: string
  closeFunction?: () => void,
  width?: string,
  maxWidth?: string,
  modalType?: ModalType
};
