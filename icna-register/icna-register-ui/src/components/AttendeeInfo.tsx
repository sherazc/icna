import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {registerApis} from "../service/api/ApiRegister";
import {AttendeeDto, defaultAttendeeDto, EventDto} from "../service/service-types";

interface Props {
}

export const AttendeeInfo: React.FC<Props> = () => {
    const {attendeeId} = useParams();
    const [attendee, setAttendee] = useState<AttendeeDto>(defaultAttendeeDto());

    useEffect(() => {
        if (!attendeeId) {
            return;
        }

        registerApis()
            .findAttendeeByAttendeeId(attendeeId)
            .then((attendeeResponse) => setAttendee(attendeeResponse))
    }, []);
    return (
        <div>
            <div>Attendee</div>
            <div>{attendee.firstName} {attendee.lastName} </div>
            <hr/>
            <div>Group</div>

        </div>
    );
}