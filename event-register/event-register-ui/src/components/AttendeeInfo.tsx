import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {AttendeeDto, defaultAttendeeDto} from "../service/service-types";
import tableGridStyles from "../styles/TableGridStyle.module.scss"
import {createLoadingActionHide, createLoadingActionShow} from "./Loading";
import {AppContext} from "../store/context";

interface Props {
}

export const AttendeeInfo: React.FC<Props> = () => {
    const {attendeeId, eventId} = useParams();
    const [attendee, setAttendee] = useState<AttendeeDto>(defaultAttendeeDto());
    const [registrationAttendees, setRegistrationAttendees] = useState<AttendeeDto[]>([]);
    const [{regApis}, dispatch] = useContext(AppContext);

    useEffect(() => {
        if (!attendeeId || !eventId) {
            return;
        }

        const loadingAttendee = createLoadingActionShow("Loading Attendee");
        dispatch(loadingAttendee);
        regApis
            .findAttendeeByAttendeeId(attendeeId)
            .then((attendeeResponse) => {
                setAttendee(attendeeResponse);
                dispatch(createLoadingActionHide(loadingAttendee.payload.id));
                const loadingRegistration = createLoadingActionShow("Loading Registration");
                dispatch(loadingRegistration);
                regApis
                    .findAttendeeByEventIdAndRegistrationId(eventId, `${attendeeResponse.registrationId}`)
                    .then((registrationAttendeesResponse) => {
                        setRegistrationAttendees(registrationAttendeesResponse);
                        dispatch(createLoadingActionHide(loadingRegistration.payload.id));
                    })
            })
    }, [eventId, attendeeId]);

    const buildAttendeeGrid = (attendeesArray: AttendeeDto[]) => {
        if (attendeesArray.length < 1) {
            return (<div>Attendee not found</div>);
        }

        return (
            <table className={tableGridStyles.simpleDataGrid}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {attendeesArray.map((attendee) => (
                    <tr key={attendee.id}>
                        <td>
                            <Link to={`/event/${attendee.eventId}/attendees/${attendee.id}`}>{attendee.id}</Link>
                        </td>
                        <td>{attendee.firstName} {attendee.lastName}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }


    return (
        <div>
            <div><h1>Attendee Profile</h1></div>
            <div>Id: {attendee.id}</div>
            <div>{attendee.firstName} {attendee.lastName}</div>
            <hr/>

            <h2>Attendee's Registration Group</h2>
            <p>
                <Link to={`/event/${attendee.eventId}/register/${attendee.registrationId}`}>Edit Registration {attendee.registrationId}</Link>
            </p>
            {buildAttendeeGrid(registrationAttendees)}
        </div>
    );
}