import React, {useEffect, useState} from "react";
import {EventDto, defaultEventDto, EventProgramDto} from "../service/service-types";
import {registerApis} from "../service/api/ApiRegister";
import {useParams} from "react-router-dom";

interface Props {
}

export const Home: React.FC<Props> = () => {
    const {eventId} = useParams();
    const [event, setEvent] = useState<EventDto>(defaultEventDto());
    const [eventProgramDtoArray, setEventProgramDtoArray] = useState<EventProgramDto[]>([]);

    useEffect(() => {
        if (!eventId) {
            return;
        }

        let regApis = registerApis();

        regApis
            .findEventById(eventId)
            .then(event => setEvent(event));
        regApis
            .findProgramsByEventId(eventId)
            .then(eventProgramDtoArrayResponse => setEventProgramDtoArray(eventProgramDtoArrayResponse))
    }, [eventId])

    return (<div>
        <div>{event.eventName}</div>
        <hr/>
        <div>Event Programs</div>
        <ul>
            {eventProgramDtoArray.map(ep => (
                <li key={ep.id}>{ep.programName}</li>
            ))}
        </ul>
    </div>)
}
