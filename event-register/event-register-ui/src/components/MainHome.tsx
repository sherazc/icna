import React, {useContext, useEffect, useState} from "react";
import {registerApis} from "../service/api/ApiRegister";
import {EventDto} from "../service/service-types";
import {AppContext} from "../store/context";
import {createLoadingActionHide, createLoadingActionShow} from "./Loading";
import {Link} from "react-router-dom";
import styles from "./MainHome.module.scss";

/*
Create Event
Edit event

 */

export const MainHome: React.FC = () => {
    const [events, setEvents] = useState<EventDto[]>([])
    const regApis = registerApis();
    const [{}, dispatch] = useContext(AppContext);
    useEffect(() => {
        loadData()
    }, []);

    const loadData = async () => {
        const loadingEvent = createLoadingActionShow("Loading Events");
        dispatch(loadingEvent);
        setEvents(await regApis.eventFutureActive());
        dispatch(createLoadingActionHide(loadingEvent.payload.id));
    }

    const buildEventTile = (event: EventDto) => (
        <Link to={`/event/${event.id}`} key={event.id}>
            <div className={styles.eventBox}>
                <h3>{event.eventName}</h3>
                <div>Starts on {event.startDate.isoDate}</div>
                {event.endDate && <div>Ends on {event.endDate.isoDate}</div>}
            </div>
        </Link>
    );

    return (
        <div>
            <h1>Conference Events</h1>

            <div>
                {events.map(e => buildEventTile(e))}
            </div>
        </div>
    );
}