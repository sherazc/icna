import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {registerApis} from "../service/api/ApiRegister";
import {AttendeeDto, defaultAttendeeDto, EventProgramDto} from "../service/service-types";
import {formIdBreak, formIdCreate} from "../service/utilities";

interface Props {
}

let temporaryAttendeeId = -1

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

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const [attendeeIdString, fieldName] = formIdBreak(event.target.id)
        const value = event.target.value;

        const modifiedAttendees = attendees.map(attendee => {
            if (attendee.id === +attendeeIdString) {
                const newAttendee: any = {...attendee};
                newAttendee[fieldName] = value;
                return newAttendee as AttendeeDto;
            } else {
                return attendee;
            }
        });

        setAttendees(modifiedAttendees);
    };

    const onChangeChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        const [attendeeIdString, fieldName, subId] = formIdBreak(event.target.id)
        const checked = event.target.checked;

        const modifiedAttendees = attendees.map(attendee => {
            if (attendee.id === +attendeeIdString) {
                const newAttendee: AttendeeDto = {...attendee};
                if (checked) {
                    const eventProgram
                        = allEventPrograms.find(ep => ep.id === +subId);
                    if (eventProgram) {
                        newAttendee.eventPrograms?.push(eventProgram);
                    }
                } else {
                    newAttendee.eventPrograms = newAttendee.eventPrograms
                        ?.filter(ep => ep.id !== +subId);
                }

                return newAttendee as AttendeeDto;
            } else {
                return attendee;
            }
        });

        setAttendees(modifiedAttendees);
    }

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

    const deleteAttendee = (attendeeId: number) => {
        const newAttendeeArray = attendees.filter(a => a.id !== attendeeId);
        setAttendees(newAttendeeArray);
    }

    const createAttendeeForm = (attendee: AttendeeDto) => (
        <div key={attendee.id}>
            <div><button type="button" onClick={() => deleteAttendee(attendee.id)}>Delete</button> </div>
            <div>
                <label htmlFor={formIdCreate([`${attendee.id}`, 'firstName'])}>First Name: </label>
                <input
                    id={formIdCreate([`${attendee.id}`, 'firstName'])}
                    onChange={onChange}
                    value={attendee.firstName}/>
            </div>
            <div>
                <label htmlFor={formIdCreate([`${attendee.id}`, 'lastName'])}>Last Name: </label>
                <input
                    id={formIdCreate([`${attendee.id}`, 'lastName'])}
                    onChange={onChange}
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
                        onChange={onChangeChecked}
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
