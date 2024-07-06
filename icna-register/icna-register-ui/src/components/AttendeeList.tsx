import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
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
            .then((event: EventDto) => {
                setEvent(event)
            });
    }, [])

    const buildAttendeeGrid = () => {
        if (attendees.length <) {

        }

        return (
            <table>
                <thead>
                </thead>
            </table>
        );
    }

    return (
        <div>
            <div>{event.eventName}</div>
        </div>
    )
}