import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {registerApis} from "../service/api/ApiRegister";
import {
    AttendeeDto,
    defaultAttendeeDto, defaultRegistrationDto,
    defaultUserProfileDto,
    EventProgramDto,
    RegistrationDto
} from "../service/service-types";
import {castStringToNumber, formIdBreak, formIdCreate} from "../service/utilities";
import checkRadio from "../styles/CheckRadio.module.scss"
import {AppContext} from "../store/context";
import {createLoadingActionHide, createLoadingActionShow} from "./Loading";

interface Props {
}

let temporaryAttendeeId = -1

export const Register: React.FC<Props> = () => {
    const {eventId, registrationId} = useParams();
    const [allEventPrograms, setAllEventPrograms] = useState<EventProgramDto[]>([]);
    const [registrationDto, setRegistrationDto] = useState<RegistrationDto>(defaultRegistrationDto());
    const [{}, dispatch] = useContext(AppContext);


    const [attendees, setAttendees] = useState<AttendeeDto[]>([]);

    useEffect(() => {
        if (!eventId || !registrationId) {
            return;
        }

        loadEventPrograms(eventId).then(() => {
        });
        loadAttendees(eventId, registrationId).then(() => {
        });
        loadRegistration(registrationId).then(() => {
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
        // eslint-disable-next-line
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

        const loadingAttendee = createLoadingActionShow("Loading Attendee");
        dispatch(loadingAttendee);
        const regApis = registerApis();
        const attendeeDtoArray: AttendeeDto[] = await regApis.findAttendeeByEventIdAndRegistrationId(eventId, registrationId);
        setAttendees(attendeeDtoArray);
        dispatch(createLoadingActionHide(loadingAttendee.payload.id));
    };

    const loadRegistration = async (registrationId: string) => {
        if (registrationId === 'new') {
            let registrationDtoNew = defaultRegistrationDto();
            registrationDtoNew.id = -1
            let attendeeDto = defaultAttendeeDto();
            attendeeDto.id = temporaryAttendeeId--;
            registrationDtoNew.attendees = [attendeeDto];
            setRegistrationDto(registrationDtoNew);
            return;
        }

        const loadingAction = createLoadingActionShow("Loading Registration");
        dispatch(loadingAction);
        const regApis = registerApis();
        const registrationDtoResponse: RegistrationDto = await regApis.findRegistrationByRegistrationId(registrationId);
        setRegistrationDto(registrationDtoResponse);
        dispatch(createLoadingActionHide(loadingAction.payload.id));
    };

    const loadEventPrograms = async (eventId: string) => {
        const loadingEvent = createLoadingActionShow("Loading Events");
        dispatch(loadingEvent);
        const eventPrograms = await registerApis().findProgramsByEventId(eventId);
        setAllEventPrograms(eventPrograms);
        dispatch(createLoadingActionHide(loadingEvent.payload.id));
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const registrationForm: RegistrationDto = {
            id: castRegistrationId(registrationId),
            attendees,
            userProfile: defaultUserProfileDto()
        }

        const loadingSaving = createLoadingActionShow("Saving Registration");
        dispatch(loadingSaving);
        const responseRegistrationDto = await registerApis().saveRegistration(eventId as string, registrationForm);
        dispatch(createLoadingActionHide(loadingSaving.payload.id));
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
            {attendee.id > 0 &&
                <div>
                    <Link target="_blank"
                          to={`/event/${attendee.eventId}/print/attendees/${attendee.id}`}>
                        Print Badge
                    </Link>
                </div>
            }
            <div>
                <a href="#"
                   onClick={() => deleteAttendee(attendee.id)}>Delete {attendee.firstName} {attendee.lastName}</a>
            </div>
            <hr/>
        </div>
    );

    const createEventProgramForm = (attendeeId: number, epAll: EventProgramDto[], epSelected?: EventProgramDto[]) => (
        <div>
            {epAll.map(ep => (
                <div key={ep.id}>
                    <label className={checkRadio.checkContainer}
                           htmlFor={formIdCreate([`${attendeeId}`, 'eventPrograms', `${ep.id}`])}>
                        {ep.programName}
                        <input id={formIdCreate([`${attendeeId}`, 'eventPrograms', `${ep.id}`])}
                               type="checkbox"
                               onChange={onChangeCheckedEventProgram}
                               checked={isEventProgramInArray(ep, epSelected)}/>
                        <span className={checkRadio.checkbox}></span>
                    </label>
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
            <div><h1>Register</h1></div>
            <div>
                <a href="#" onClick={() => addAttendee(temporaryAttendeeId--)}>Add Attendee</a>
            </div>
            <hr/>
            <form action="#" onSubmit={onSubmit}>
                {attendees.map(a => createAttendeeForm(a))}
                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
};
