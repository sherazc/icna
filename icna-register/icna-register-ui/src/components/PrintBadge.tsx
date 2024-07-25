import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {AttendeeDto, defaultEventDto, EventDto} from "../service/service-types";
import {registerApis} from "../service/api/ApiRegister";

interface Props {
}

let regApis = registerApis();

export const PrintBadge: React.FC<Props> = () => {
    const {eventId, registrationId, attendeeId} = useParams();

    const [event, setEvent] = useState<EventDto>(defaultEventDto());
    const [attendees, setAttendees] = useState<AttendeeDto[]>([]);

    useEffect(() => {
        if (!eventId || !registrationId) {
            return;
        }
        loadEvents(eventId);
        loadRegistration(eventId, registrationId);
    }, [eventId, registrationId]);

    useEffect(() => {
        if (!eventId || !attendeeId) {
            return;
        }
        loadEvents(eventId);
        loadAttendee(attendeeId);
    }, [eventId, attendeeId]);


    const loadEvents = async (eventIdArg: string) => {
        setEvent(await regApis.findEventById(eventIdArg));
    }

    const loadRegistration = async (eventIdArg: string, registrationIdArg: string) => {
        const attendeeDtoArray: AttendeeDto[] = await regApis.findAttendeeByEventIdAndRegistrationId(eventIdArg, registrationIdArg);
        setAttendees(attendeeDtoArray)
    }

    const loadAttendee = async (attendeeIdArg: string) => {
        setAttendees([await regApis.findAttendeeByAttendeeId(attendeeIdArg)]);
    }

    return (
        <div>Print badge</div>
    );
};