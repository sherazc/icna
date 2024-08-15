import React, {useContext, useEffect, useState} from "react";
import {EventDto, defaultEventDto, EventProgramDto} from "../service/service-types";
import {registerApis} from "../service/api/ApiRegister";
import {Link, useParams} from "react-router-dom";
import {AppContext} from "../store/context";
import {createLoadingActionHide, createLoadingActionShow} from "./Loading";
import styles from "./Home.module.scss"
import {IconArrowRight} from "../images/IconArrowRight";

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

        const regApis = registerApis();

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

    return (
        <div>
            <div>
                <h1>{event.eventName}</h1>
            </div>
            <div className={styles.eventProgramsLoginContainer}>
                <div className={styles.eventProgramsContainer}>
                    <div><h2>Event Programs</h2></div>
                    {eventProgramDtoArray.map(ep => (
                        <div key={ep.id}>{ep.programName}</div>
                    ))}

                    <div style={{marginTop: "32px"}}>
                        <Link to={`/event/${eventId}/register/new`}>Register <IconArrowRight/></Link>
                    </div>
                </div>
                <div className={styles.loginContainer}>
                    <div className={styles.loginBox}>
                        <div style={{marginBottom: "20px"}}>
                            <label htmlFor="">Login</label>
                        </div>
                        <input placeholder="Email" style={{width: "290px"}}/>
                        <a style={{justifyContent: "right", marginTop: "20px"}} href="#">
                            Login with password <IconArrowRight />
                        </a>
                        <a style={{justifyContent: "right", marginTop: "20px"}} href="#">
                            Login email code <IconArrowRight />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
