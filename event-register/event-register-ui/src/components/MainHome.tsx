import React, {useContext, useEffect, useState} from "react";
import {EventDto} from "../service/service-types";
import {AppContext} from "../store/context";
import {createLoadingActionHide, createLoadingActionShow} from "./Loading";
import {Link, useNavigate} from "react-router-dom";
import styles from "./MainHome.module.scss";

export const MainHome: React.FC = () => {
    const [events, setEvents] = useState<EventDto[]>([])
    const [{regApis}, dispatch] = useContext(AppContext);
    const navigate = useNavigate();

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
                <button onClick={() => navigate("/create-event")}>Create Event</button>
            </div>
            <div>
            {events.map(e => buildEventTile(e))}
            </div>
        </div>
    );
}