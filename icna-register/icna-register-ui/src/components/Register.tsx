import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {registerApis} from "../service/api/ApiRegister";
import {AttendeeDto, defaultAttendeeDto, EventProgramDto} from "../service/service-types";

const formIdCreate = (attendeeId: number, fieldName: string) => `${attendeeId}_${fieldName}`;
const formIdBreak = (formId: string) => formId.split('_')


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

        loadEventPrograms(eventId)

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
                <label>First Name: </label>
                <input value={attendee.firstName}/>
            </div>
            <div>
                <label>Last Name: </label>
                <input value={attendee.lastName}/>
            </div>
            {allEventPrograms && createEventProgramForm(allEventPrograms, attendee.eventPrograms)}
            <hr/>
        </div>
    );

    const createEventProgramForm = (epAll: EventProgramDto[], epSelected?: EventProgramDto[]) => (
        <div>
            {epAll.map(ep => (
                <input type="checkbox"/>
            ))}
        </div>
    );



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


