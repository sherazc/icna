import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {registerApis} from "../service/api/ApiRegister";
import {
    AttendeeDto,
    defaultAttendeeDto,
    defaultRegistrationDto,
    EventProgramDto,
    RegistrationDto, UserProfileDto
} from "../service/service-types";
import {castStringToNumber, formIdBreak, formIdCreate, touchNumber} from "../service/utilities";
import checkRadio from "../styles/CheckRadio.module.scss"
import {AppContext} from "../store/context";
import {createLoadingActionHide, createLoadingActionShow} from "./Loading";
import {FormPassword} from "../service/form-types";

interface Props {
}

let temporaryAttendeeId = -1

export const Register: React.FC<Props> = () => {
    const {eventId, registrationId} = useParams();
    const [allEventPrograms, setAllEventPrograms] = useState<EventProgramDto[]>([]);
    const [registrationDto, setRegistrationDto] = useState<RegistrationDto>(defaultRegistrationDto());
    const [{}, dispatch] = useContext(AppContext);
    const [registrationPassword, setRegistrationPassword] = useState<FormPassword>({passwordField: "", passwordConfirm: ""})

    useEffect(() => {
        if (!eventId || !registrationId) {
            return;
        }
        loadEventPrograms(eventId).then(() => {
        });
        loadRegistration(registrationId).then(() => {
        });
    }, [eventId, registrationId]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const [attendeeIdString, fieldName] = formIdBreak(event.target.id)
        const value = event.target.value;

        const modifiedAttendees = registrationDto.attendees.map(attendee => {
            if (attendee.id === +attendeeIdString) {
                const newAttendee: any = {...attendee};
                newAttendee[fieldName] = value;
                return newAttendee as AttendeeDto;
            } else {
                return attendee;
            }
        });
        setRegistrationDto({...registrationDto, attendees: modifiedAttendees});
    };

    const onChangeCheckedEventProgram = (event: React.ChangeEvent<HTMLInputElement>) => {
        // eslint-disable-next-line
        const [attendeeIdString, fieldName, subId] = formIdBreak(event.target.id)
        const checked = event.target.checked;

        const modifiedAttendees = registrationDto.attendees.map(attendee => {
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
        setRegistrationDto({...registrationDto, attendees: modifiedAttendees});
    }


    const loadRegistration = async (registrationId: string) => {
        if (registrationId === 'new') {
            let registrationDtoNew = defaultRegistrationDto();
            registrationDtoNew.id = undefined
            registrationDtoNew.userProfile.id = undefined;
            registrationDtoNew.userProfile.eventId = castStringToNumber(eventId);
            let attendeeDto = defaultAttendeeDto();
            attendeeDto.id = temporaryAttendeeId--;
            attendeeDto.registrationId = undefined;
            attendeeDto.eventId = castStringToNumber(eventId);
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
        const registrationForm2: RegistrationDto = {...registrationDto}

        registrationForm2.id = (!registrationId || registrationId === 'new') ? undefined : +registrationId;

        const loadingSaving = createLoadingActionShow("Saving Registration");
        dispatch(loadingSaving);
        // const responseRegistrationDto = await registerApis().saveRegistration(eventId as string, registrationForm);
        const responseRegistrationDto = await registerApis().saveRegistration(eventId as string, registrationForm2);
        dispatch(createLoadingActionHide(loadingSaving.payload.id));
    };

    const deleteAttendee = (attendeeId: number) => {
        const newAttendeeArray2 = registrationDto.attendees.filter(a => a.id !== attendeeId);
        setRegistrationDto({...registrationDto, attendees: newAttendeeArray2});
    };

    const addAttendee = (attendeeId: number) => {
        const newAttendee = defaultAttendeeDto();
        newAttendee.id = attendeeId
        newAttendee.eventId = castStringToNumber(eventId);
        newAttendee.registrationId = registrationId ? +registrationId : undefined;

        const newAttendees = registrationDto.attendees.map(a => a);
        newAttendees.push(newAttendee)
        setRegistrationDto({...registrationDto, attendees: newAttendees})
    };

    const onChangeUserProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const existingUserProfile = registrationDto.userProfile
        const registrationDtoNew: RegistrationDto = {...registrationDto,
            userProfile: {...existingUserProfile, [event.target.id]: event.target.value}};
        setRegistrationDto(registrationDtoNew);
    }


    const createUserProfileForm = (userProfile: UserProfileDto) => (
        <div>
            <div>
                <label htmlFor="eamil">Email: </label>
                <input
                    id="email"
                    onChange={onChangeUserProfile}
                    required
                    value={userProfile.email}/>
            </div>

            <div>
                <label htmlFor="userPassword">Password: </label>
                <input
                    id="userPassword"
                    onChange={onChangeUserProfile}
                    value={userProfile.userPassword}/>
            </div>
            <div>
                <label htmlFor="eamil">Confirm Password: </label>
                <input
                    id="userPasswordConfirm"
                    onChange={onChangeUserProfile}
                    value={userProfile.userPassword}/>
            </div>
        </div>
    );

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
        <form action="#" onSubmit={onSubmit}>
        <div>
            <div><h1>Register</h1></div>
            {createUserProfileForm(registrationDto.userProfile)}
            <div>
                <a href="#" onClick={() => addAttendee(temporaryAttendeeId--)}>Add Attendee</a>
            </div>
            <hr/>
                {registrationDto.attendees.map(a => createAttendeeForm(a))}
                <input type="submit" value="Submit"/>
        </div>
        </form>
    );
};
