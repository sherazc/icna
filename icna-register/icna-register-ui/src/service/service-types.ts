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
