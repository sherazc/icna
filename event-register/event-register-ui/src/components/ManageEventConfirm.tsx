import React, {useContext, useEffect, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import {AppContext} from "../store/context";
import {defaultEventDto} from "../service/service-types";

export const ManageEventConfirm = () => {

    const {eventId} = useParams();
    const [{regApis, authUserToken}] = useContext(AppContext);
    const [eventDto, setEventDto] = useState(defaultEventDto());
    const authenticated = authUserToken.userProfileId > 0;

    const loadData = async () => {
        if (!eventId) {
            return;
        }
        setEventDto(await regApis.findEventById(eventId))
    }

    useEffect(() => {
        loadData();
    }, [eventId]);

    return (
        <div>
            <h1>Event Saved</h1>
            <h3>{eventDto.eventName}</h3>
            {!authenticated && <div><NavLink to={`/event/${eventId}`}>Login to edit</NavLink></div>}
        </div>
    );
}