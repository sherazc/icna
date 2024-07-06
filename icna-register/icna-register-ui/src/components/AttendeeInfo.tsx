import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {registerApis} from "../service/api/ApiRegister";
import {AttendeeDto, defaultAttendeeDto, EventDto} from "../service/service-types";

interface Props {
}

export const AttendeeInfo: React.FC<Props> = () => {
    const {attendeeId, eventId} = useParams();
    const [attendee, setAttendee] = useState<AttendeeDto>(defaultAttendeeDto());
    const [registrationAttendees, setRegistrationAttendees] = useState<AttendeeDto[]>([]);

    useEffect(() => {
        if (!attendeeId || !eventId) {
            return;
        }

        let regApis = registerApis();
        regApis
            .findAttendeeByAttendeeId(attendeeId)
            .then((attendeeResponse) => {
                setAttendee(attendeeResponse)

                regApis
                    .findAttendeeByEventIdAndRegistrationId(eventId, `${attendeeResponse.registrationId}`)
                    .then((registrationAttendeesResponse) => setRegistrationAttendees(registrationAttendeesResponse))
            })
    }, [eventId, attendeeId]);

    const buildAttendeeGrid = (attendeesArray: AttendeeDto[]) => {
        if (attendeesArray.length < 1) {
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
                {attendeesArray.map((attendee) => (
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
            <div>Attendee</div>
            <div>{attendee.firstName} {attendee.lastName} </div>
            <hr/>
            <div>Registration Group</div>
            {buildAttendeeGrid(registrationAttendees)}
        </div>
    );
}