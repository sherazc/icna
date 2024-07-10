import {AttendeeDto} from "./service-types";

export type RegisterFormType = {
    registrationId: number;
    eventId: number;
    attendees: AttendeeDto[];
}