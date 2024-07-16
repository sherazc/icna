import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {registerApis} from "../service/api/ApiRegister";
import {AttendeeDto, defaultAttendeeDto, EventProgramDto, RegistrationDto} from "../service/service-types";
import {castStringToNumber, formIdBreak, formIdCreate} from "../service/utilities";

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

    const castRegistrationId = (regIdString: string | undefined): number =>
        (!regIdString || registrationId === 'new') ? -1 : +regIdString


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

    const onChangeCheckedEventProgram = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            let attendeeDto = defaultAttendeeDto();
            attendeeDto.id = temporaryAttendeeId--;
            setAttendees([attendeeDto]);
            return;
        }

        let regApis = registerApis();
        const attendeeDtoArray: AttendeeDto[] = await regApis.findAttendeeByEventIdAndRegistrationId(eventId, registrationId);
        setAttendees(attendeeDtoArray)
    };

    const loadEventPrograms = async (eventId: string) => {
        const eventPrograms = await registerApis().findProgramsByEventId(eventId);
        setAllEventPrograms(eventPrograms);
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const registrationForm: RegistrationDto = {
            id: castRegistrationId(registrationId),
            attendees
        }

        const responseRegistrationDto = await registerApis().saveRegistration(eventId as string, registrationForm);
        console.log(responseRegistrationDto);
    };

    const deleteAttendee = (attendeeId: number) => {
        const newAttendeeArray = attendees.filter(a => a.id !== attendeeId);
        setAttendees(newAttendeeArray);
    };

    const addAttendee = (attendeeId: number) => {
        const newAttendee = defaultAttendeeDto();
        newAttendee.id = attendeeId
        newAttendee.eventId = castStringToNumber(eventId);
        newAttendee.registrationId = registrationId ? +registrationId : 0;
        const newAttendees = attendees.map(a => a);
        newAttendees.push(newAttendee)
        setAttendees(newAttendees);
    };


    const createAttendeeForm = (attendee: AttendeeDto) => (
        <div key={attendee.id}>
            <div>
                <button type="button" onClick={() => deleteAttendee(attendee.id)}>Delete Attendee</button>
            </div>
            <div>
                <label htmlFor={formIdCreate([`${attendee.id}`, 'firstName'])}>First Name: </label>
                <input
                    id={formIdCreate([`${attendee.id}`, 'firstName'])}
                    onChange={onChange}
                    required
                    value={attendee.firstName}/>
            </div>
            <div>
                <label htmlFor={formIdCreate([`${attendee.id}`, 'lastName'])}>Last Name: </label>
                <input
                    id={formIdCreate([`${attendee.id}`, 'lastName'])}
                    onChange={onChange}
                    required
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
                        onChange={onChangeCheckedEventProgram}
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
            <div>
                <button type="button" onClick={() => addAttendee(temporaryAttendeeId--)}>Add Attendee</button>
            </div>
            <form action="#" onSubmit={onSubmit}>
                {attendees.map(a => createAttendeeForm(a))}
                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
};
