import React, {useContext, useEffect, useState} from "react";
import {EventDto, defaultEventDto, EventProgramDto} from "../service/service-types";
import {registerApis} from "../service/api/ApiRegister";
import {useParams} from "react-router-dom";
import {AppContext} from "../store/context";
import {createLoadingActionHide, createLoadingActionShow} from "./Loading";

interface Props {
}

export const Home: React.FC<Props> = () => {
    const {eventId} = useParams();
    const [event, setEvent] = useState<EventDto>(defaultEventDto());
    const [eventProgramDtoArray, setEventProgramDtoArray] = useState<EventProgramDto[]>([]);
    const [{}, dispatch] = useContext(AppContext);

    useEffect(() => {
        if (!eventId) {
            return;
        }

        let regApis = registerApis();

        const loadingEvent = createLoadingActionShow("Loading Events");
        dispatch(loadingEvent);
        regApis
            .findEventById(eventId)
            .then(event => {
                setEvent(event);
                dispatch(createLoadingActionHide(loadingEvent.payload.id))
            });

        const loadingProgram = createLoadingActionShow("Loading programs");
        dispatch(loadingProgram);
        regApis
            .findProgramsByEventId(eventId)
            .then(eventProgramDtoArrayResponse => {
                setEventProgramDtoArray(eventProgramDtoArrayResponse);
                dispatch(createLoadingActionHide(loadingProgram.payload.id))
            })
    }, [eventId])

    return (<div>
        <div>
            <h1>{event.eventName}</h1>
        </div>
        <div><h2>Event Programs</h2></div>

        {eventProgramDtoArray.map(ep => (
            <div key={ep.id}>{ep.programName}</div>
        ))}

    </div>)
}
