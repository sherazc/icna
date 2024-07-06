import React, {useEffect, useState} from "react";
import {EventDto, defaultEventDto} from "../service/service-types";
import {registerApis} from "../service/api/ApiRegister";
import {useParams} from "react-router-dom";

interface Props {
}

export const Home: React.FC<Props> = () => {
    const {eventId} = useParams();
    const [event, setEvent] = useState<EventDto>(defaultEventDto());

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

    return <>
        {event.eventName}
    </>
}
