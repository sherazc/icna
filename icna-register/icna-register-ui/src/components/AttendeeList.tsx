import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {AttendeeDto, defaultEventDto, EventDto} from "../service/service-types";
import {registerApis} from "../service/api/ApiRegister";
import tableGridStyles from "../styles/TableGridStyle.module.scss"
import {AppContext} from "../store/context";
import {createLoadingActionHide, createLoadingActionShow} from "./Loading";

interface Props {
}

export const AttendeeList: React.FC<Props> = () => {
    const {eventId} = useParams();
    const [event, setEvent] = useState<EventDto>(defaultEventDto());
    const [attendees, setAttendees] = useState<AttendeeDto[]>([]);
    const [{}, dispatch] = useContext(AppContext);

    useEffect(() => {
        if (!eventId) {
            return;
        }

        const loadingFindEventById = createLoadingActionShow("Loading Events");
        dispatch(loadingFindEventById);
        registerApis()
            .findEventById(eventId)
            .then((event: EventDto) => {
                setEvent(event);
                dispatch(createLoadingActionHide(loadingFindEventById.payload.id));
            });

        const loadingFindAttendeeByEventId = createLoadingActionShow("Loading Attendees");
        dispatch(loadingFindEventById);
        registerApis()
            .findAttendeeByEventId(eventId)
            .then((attendeesRes) => {
                setAttendees(attendeesRes);
                dispatch(createLoadingActionHide(loadingFindAttendeeByEventId.payload.id));
            })
    }, [eventId]);

    // Use data table
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
                    <th>Edit Registration</th>
                    <th>Print Registration Badges</th>
                    <th>Print Attendee Badge</th>
                </tr>
                </thead>
                <tbody>
                {attendeesArray.map((attendee) => (
                    <tr key={attendee.id}>
                        <td>
                            <Link to={`/event/${attendee.eventId}/attendees/${attendee.id}`}>{attendee.id}</Link>
                        </td>
                        <td>{attendee.firstName} {attendee.lastName}</td>
                        <td>
                            <Link
                                to={`/event/${attendee.eventId}/register/${attendee.registrationId}`}>
                                Edit {attendee.registrationId}
                            </Link>
                        </td>
                        <td>
                            <Link target="_blank"
                                to={`/event/${attendee.eventId}/print/register/${attendee.registrationId}`}>
                                Print All
                            </Link>
                        </td>
                        <td>
                            <Link target="_blank"
                                to={`/event/${attendee.eventId}/print/attendees/${attendee.id}`}>
                                Print
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }

    return (
        <div>
            <div>
                <h1>Attendees</h1>
                <h2>{event.eventName}</h2>
            </div>
            {buildAttendeeGrid(attendees)}
        </div>
    )
}