import type { clinicApis } from "./api/ApiClinic";

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

export type AuthUserTokenDto = {
    userProfileId: number;
    companyId: number;
    subject: string;
    issuedAtUtc: string;
    expiresAtUtc: string;
    roles: AuthRole[];
    token: string;
};

export type AuthRole  = 'BASIC_USER' // Users who register for the event
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