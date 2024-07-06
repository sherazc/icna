import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {AttendeeDto, defaultEventDto, EventDto} from "../service/service-types";
import {registerApis} from "../service/api/ApiRegister";

interface Props {
}

export const AttendeeList: React.FC<Props> = () => {
    const {eventId} = useParams();
    const [event, setEvent] = useState<EventDto>(defaultEventDto());
    const [attendees, setAttendees] = useState<AttendeeDto[]>([]);


    useEffect(() => {
        if (!eventId) {
            return;
        }

        registerApis()
            .findEventById(eventId)
            .then((event: EventDto) => setEvent(event));

        registerApis()
            .findAttendeeByEventId(eventId)
            .then((attendeesRes) => setAttendees(attendeesRes))
    }, [])

    const buildAttendeeGrid = () => {
        if (attendees.length < 1) {
            return (<div>Attendee not found</div>);
        }

        return (
            <table border={1}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Registration ID</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {attendees.map((attendee) => (
                    <tr key={attendee.id}>
                        <td>
                            <Link to={`/event/${attendee.eventId}/attendees/${attendee.id}`}>{attendee.id}</Link>
                        </td>
                        <td>{attendee.registrationId}</td>
                        <td>{attendee.firstName} {attendee.lastName}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }

    return (
        <div>
            <div>{event.eventName}</div>
            {buildAttendeeGrid()}
        </div>
    )
}