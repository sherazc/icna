import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {AttendeeDto, defaultEventDto, EventDto} from "../service/service-types";

interface Props {
}

export const PrintBadge: React.FC<Props> = () => {
    const {eventId, registrationId, attendeeId} = useParams();

    const [event, setEvent] = useState<EventDto>(defaultEventDto());
    const [attendees, setAttendees] = useState<AttendeeDto[]>([]);

    useEffect(() => {
        if (!eventId || !registrationId) {
            return;
        }
        console.log("eventId ", eventId);
        console.log("registrationId ", registrationId);
    }, [eventId, registrationId]);

    useEffect(() => {
        if (!eventId || !attendeeId) {
            return;
        }
        console.log("eventId ", eventId);
        console.log("attendeeId ", attendeeId);
    }, [eventId, attendeeId]);


    return (
        <div>Print badge</div>
    );
};