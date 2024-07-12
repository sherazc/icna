import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {registerApis} from "../service/api/ApiRegister";
import {AttendeeDto, defaultAttendeeDto, EventProgramDto} from "../service/service-types";
import {formIdCreate} from "../service/utilities";

interface Props {
}

export const Register: React.FC<Props> = () => {
    const {eventId, registrationId} = useParams();
    const [attendees, setAttendees] = useState<AttendeeDto[]>([]);
    const [allEventPrograms, setAllEventPrograms] = useState<EventProgramDto[]>([]);

    useEffect(() => {
        if (!eventId || !registrationId) {
            return;
        }

        loadEventPrograms(eventId).then(() => {
        });
        loadAttendees(eventId, registrationId).then(() => {
        });
    }, [eventId, registrationId]);

    const loadAttendees = async (eventId: string, registrationId: string) => {
        if (registrationId === 'new') {
            setAttendees([defaultAttendeeDto()]);
            return;
        }

        let regApis = registerApis();
        const attendeeDtoArray: AttendeeDto[] = await regApis.findAttendeeByEventIdAndRegistrationId(eventId, registrationId);
        setAttendees(attendeeDtoArray)
    };

    const loadEventPrograms = async (eventId: string) => {
        const eventPrograms = await registerApis().findProgramsByEventId(eventId);
        setAllEventPrograms(eventPrograms);
    }


    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Submitting", new Date());
    }

    const createAttendeeForm = (attendee: AttendeeDto) => (
        <div key={attendee.id}>
            <div>
                <label htmlFor={formIdCreate([`${attendee.id}`, 'firstName'])}>First Name: </label>
                <input
                    id={formIdCreate([`${attendee.id}`, 'firstName'])}
                    value={attendee.firstName}/>
            </div>
            <div>
                <label htmlFor={formIdCreate([`${attendee.id}`, 'lastName'])}>Last Name: </label>
                <input
                    id={formIdCreate([`${attendee.id}`, 'lastName'])}
                    value={attendee.lastName}/>
            </div>
            {allEventPrograms && createEventProgramForm(attendee.id, allEventPrograms, attendee.eventPrograms)}
            <hr/>
        </div>
    );

    const createEventProgramForm = (attendeeId: number, epAll: EventProgramDto[], epSelected?: EventProgramDto[]) => (
        <div>
            {epAll.map(ep => (
                <div key={ep.id}>
                    <input
                        id={formIdCreate([`${attendeeId}`, 'eventPrograms', `${ep.id}`])}
                        type="checkbox"
                        checked={isEventProgramInArray(ep, epSelected)}/>
                    <label htmlFor="">{ep.programName}</label>
                </div>
            ))}
        </div>
    );

    const isEventProgramInArray = (ep: EventProgramDto, eps?: EventProgramDto[]) => {
        if (!eps) {
            return false;
        }
        return eps.some(e => ep.id === e.id);
    };

    return (
        <div>
            <div>Register</div>
            <form action="#" onSubmit={onSubmit}>
                {attendees.map(a => createAttendeeForm(a))}
                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
};
