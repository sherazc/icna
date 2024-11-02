import {touchString} from "./utilities";
import {MdDate} from "./DateService";

export type EventDto = {
    id: number;
    eventName: string;
    startDate: MdDate,
    endDate?: MdDate,
    active: boolean
}
export const defaultEventDto = (): EventDto => ({id: 0, eventName: "", startDate: MdDate.currentSystemMdDate(), endDate: undefined, active: true});

/**
 * Person who is attending the event.
 * Person whose badge will be printed
 */
export type AttendeeDto = {
    id: number;
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
    id: number;
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
    id: 0,
    eventId: 0,
    email: ""
})

export type RegistrationDto = {
    id?: number;
    attendees: AttendeeDto[];
    userProfile: UserProfileDto;
}

export const defaultRegistrationDto = (): RegistrationDto => ({
    id: 0,
    attendees: [],
    userProfile: defaultUserProfileDto()
});

export type StyleType = "VAR_COLOR"| "VAR_SIZE" | "VAR_STRING";

export type StyleVariable = {
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
    userProfile: UserProfileDto;
    event: EventDto,
    programs: EventProgramDto[],
    styleVariable: StyleVariable[],
}

export const defaultEventFormDto = ():EventFormDto => ({
    userProfile: defaultUserProfileDto(),
    event: defaultEventDto(),
    programs: [],
    styleVariable: []
});
