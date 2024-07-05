import React, {useEffect, useState} from "react";
import {EventDto, eventDtoDefault} from "../service/service-types";
import {registerApis} from "../service/api/ApiRegister";
import {useParams} from "react-router-dom";

interface Props {
    eventId: string
}

export const Home: React.FC<Props> = () => {
    const {eventId} = useParams();
    const [event, setEvent] = useState<EventDto>(eventDtoDefault());

    useEffect(() => {
        console.log(eventId);
        if (!eventId) {

            return;
        }
        registerApis()
            .findEventById(eventId)
            .then((event:EventDto) => {
                setEvent(event)
            });
    }, [])

    return <>
        {event.eventName}
    </>
}
