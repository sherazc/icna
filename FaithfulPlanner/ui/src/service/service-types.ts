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
    phoneNumber?: string,
    employeeGroupId?: number,
    employeeTypes: EmployeeTypeDto[]
};

export const defaultUserProfileDto = (): UserProfileDto => ({
    email: "", employeeTypes: []
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
export const defaultEmployeeGroupDto = (): EmployeeGroupDto => ({ id: 0, groupName: "" })


/**
 * EmployeeGroupTypeDto extends EmployeeGroupDto.
 * 
 * This syntax '&' is called "TypeScript's intersection type"
 * 
 */
export type EmployeeGroupTypesDto = EmployeeGroupDto & {
    employeeTypes: EmployeeTypeDto[];
}
export const defaultEmployeeGroupTypeDto = (): EmployeeGroupTypesDto => ({ id: 0, groupName: "", employeeTypes: [] })

export type EmployeeTypeDto = {
    id?: number;
    typeName: string;
}

export const defaultEmployeeTypeDto = (): EmployeeTypeDto => ({
    id: 0,
    typeName: ""
});

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

export type OperationDayDto = {
    id?: number;
    companyId?: number,
    serviceDateString?: string,
    notes?: string
};

export const defaultOperationDayDto = (): OperationDayDto => ({});

export type OpDayDetailDto = {
    id?: number;
    companyId?: number,
    serviceDateString: string,
    serviceDateFormatted: string,
    serviceDateDayOfWeek: string,
    notes?: string,
    groups: OpDayDetailEmployeeGroupDto[],
};

export const defaultOpDayDetailDto = ():OpDayDetailDto => ({
    id:0,
    companyId: 0,
    notes: "",
    serviceDateString:"",
    serviceDateFormatted: "",
    serviceDateDayOfWeek: "",
    groups:[]
});

export type OpDayDetailEmployeeGroupDto = {
    id:number,
    groupName:string,
    users: OpDayDetailUserProfileDto[],
};

export const defaultOpDayDetailEmployeeGroupDto = (): OpDayDetailEmployeeGroupDto => ({
    id: 0,
    groupName: "",
    users: []
});

export type OpDayDetailUserProfileDto = {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    types: EmployeeTypeDto[]
};

export const defaultOpDayDetailUserProfileDto = ():OpDayDetailUserProfileDto => ({
    id: 0,
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    types: [],
});
