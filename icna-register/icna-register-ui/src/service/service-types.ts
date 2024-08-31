import {touchString} from "./utilities";

export type EventDto = {
    id: number;
    eventName: string;
}
export const defaultEventDto = (): EventDto => ({id: 0, eventName: ""});

export type AttendeeDto = {
    id: number;
    registrationId: number;
    eventId: number;
    eventName: string;
    firstName: string;
    lastName: string;
    eventPrograms?: EventProgramDto[];
};

export const defaultAttendeeDto = (): AttendeeDto => ({
    id: 0,
    registrationId: 0,
    eventId: 0,
    eventName: "",
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

export type RegistrationDto = {
    id: number;
    attendees: AttendeeDto[];
}

export type StyleVariable = {
    styleName: string;
    styleValue: string;
}

export type LoginRequest = {
    eventId: string,
    email: string,
    userPassword?: string
    oneTimeUseCode?: string;
}

export const defaultLoginRequest = (eventId: string | undefined):LoginRequest => ({
    email: "",
    eventId: touchString(eventId),
    userPassword: "",
    oneTimeUseCode: ""
})

export type AuthUserTokenDto = {
    subject: string;
    expiresAtUtc: string;
    roles: string[];
    token: string;
}

export const defaultAuthUserTokenDto = (): AuthUserTokenDto => ({
    subject: "",
    expiresAtUtc: "",
    roles: [],
    token: ""
})
