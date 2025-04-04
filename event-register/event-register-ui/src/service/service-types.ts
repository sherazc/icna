import {touchString} from "./utilities";
import {MdDate} from "./DateService";
import {registerApis} from "./api/ApiRegister";

export type EventDto = {
    id?: number;
    eventName: string;
    startDate: MdDate,
    endDate?: MdDate,
    active: boolean,
    enableMonetization: boolean,
    enableGroupRegistration: boolean,
    enableStartEndDate: boolean
}
export const defaultEventDto = (): EventDto => ({
    id: undefined,
    eventName: "",
    startDate: MdDate.currentSystemMdDate(),
    endDate: undefined,
    active: true,
    enableMonetization: false,
    enableGroupRegistration: true,
    enableStartEndDate: true
});

/**
 * Person who is attending the event.
 * Person whose badge will be printed
 */
export type AttendeeDto = {
    id: number; // Not optional because need to add and remove by id in UI. Uses negative number logic.
    registrationId?: number;
    eventId: number;
    firstName: string;
    lastName: string;
    eventPrograms?: EventProgramDto[];
};

export const defaultAttendeeDto = (): AttendeeDto => ({
    id: 0,
    registrationId: undefined,
    eventId: 0,
    firstName: "",
    lastName: "",
    eventPrograms: []
});

export type EventProgramDto = {
    id: number; // Not optional because need to add and remove by id in UI. Uses negative number logic.
    eventId: number;
    programName: string;
};

export const defaultEventProgramDto = (): EventProgramDto => ({
    id: 0,
    eventId: 0,
    programName: "",
});

/**
 * Identify Logged-in user and registration's user.
 *
 * Could be the user who runs the application or basic user who has registered.
 */
export type UserProfileDto = {
    id?: number;
    email: string;
    userPassword?: string;
    eventId: number;
}

export const defaultUserProfileDto = (): UserProfileDto => ({
    id: undefined,
    eventId: 0,
    email: ""
})

export type RegistrationDto = {
    id?: number;
    attendees: AttendeeDto[];
    userProfile: UserProfileDto;
}

export const defaultRegistrationDto = (): RegistrationDto => ({
    id: undefined,
    attendees: [],
    userProfile: defaultUserProfileDto()
});

export type StyleType = "VAR_COLOR"| "VAR_SIZE" | "VAR_STRING";

export type StyleVariable = {
    id?: number
    styleName: string;
    styleValue: string;
    styleType: StyleType;
};

/**
 * Used only in the Login.tsx component to group together values to call login API.
 *
 * API function uses it to create login request.
 *
 * There is no similar DTO in the backend.
 */
export type LoginRequest = {
    eventId: string,
    email: string,
    userPassword?: string
    oneTimeUseCode?: string;
};

export const defaultLoginRequest = (eventId: string | undefined):LoginRequest => ({
    email: "",
    eventId: touchString(eventId),
    userPassword: "",
    oneTimeUseCode: ""
});

export type AuthUserTokenDto = {
    userProfileId: number;
    registrationId: number;
    subject: string;
    expiresAtUtc: string;
    roles: AuthRole[];
    token: string;
};

export const defaultAuthUserTokenDto = (): AuthUserTokenDto => ({
    userProfileId: 0,
    registrationId: 0,
    subject: "",
    expiresAtUtc: "",
    roles: [],
    token: ""
});

export type AuthRole  = 'BASIC_USER' // Users who register for the event
    | 'ASSISTANT' // Users who work on the registration desk
    | 'ADMIN' // Users who Manage Event
;

export type FieldError = {
    fieldName: string;
    message: string;
}

export type FlagDto = {
    value: boolean;
}

export type EventFormDto = {
    adminUserProfile: UserProfileDto;
    event: EventDto,
    programs: EventProgramDto[],
    styleVariables: StyleVariable[],
}

export const defaultEventFormDto = ():EventFormDto => ({
    adminUserProfile: defaultUserProfileDto(),
    event: defaultEventDto(),
    programs: [],
    styleVariables: []
});

export type RegisterApisType = ReturnType<typeof registerApis>;
