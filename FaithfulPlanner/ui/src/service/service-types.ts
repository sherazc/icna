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
};

export const defaultUserProfileDto = (): UserProfileDto => ({
    email: "",
});

export type FieldError = {
    fieldName: string;
    message: string;
}

export type FormPassword = {
    passwordField: string;
    passwordConfirm: string;
}
