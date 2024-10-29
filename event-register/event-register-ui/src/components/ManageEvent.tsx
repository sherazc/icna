import React, {useContext, useState} from "react";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {AppContext} from "../store/context";
import {errorClass} from "../service/errors-helpers";
import errorStyles from "./Error.module.scss";
import {Error} from "./Error";
import {
    defaultEventFormDto, defaultEventProgramDto,
    EventDto,
    EventFormDto, EventProgramDto,
    FieldError,
    UserProfileDto
} from "../service/service-types";
import {FormPassword} from "../service/form-types";
import {registerApis} from "../service/api/ApiRegister";
import checkRadio from "../styles/CheckRadio.module.scss";
import {MdDate, REGX_DATE_TIME} from "../service/DateService";
import {castStringToNumber, formIdBreak, formIdCreate, trimToLength} from "../service/utilities";

let temporaryId = -1;

export const ManageEvent = () => {
    const {eventId} = useParams();
    const navigate = useNavigate();
    const [{authUserToken}, dispatch] = useContext(AppContext);
    const cancelLink = eventId ? `/event/${eventId}` : "/";
    const authenticated = authUserToken.userProfileId > 0;
    const adminUser = authUserToken.roles.includes("ADMIN");

    const [eventPassword, setEventPassword] = useState<FormPassword>({
        passwordField: "",
        passwordConfirm: ""
    })
    const [createPassword, setCreatePassword] = useState<boolean>(false)
    const [errors, setErrors] = useState<FieldError[]>([]);
    const [eventFormDto, setEventFormDto] = useState<EventFormDto>(defaultEventFormDto());
    const regApis = registerApis()

    if (authenticated && !adminUser) {
        return <Navigate to={`/event/${eventId}`} />
    }

    const onChangeCreatePassword = () => {
        setCreatePassword(!createPassword);
        setEventPassword({passwordConfirm: "", passwordField: ""});
    }

    const onChangeEventActive = () => {
        setEventFormDto({...eventFormDto, event: {...eventFormDto.event, active: !eventFormDto.event.active}});
    }

    const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEventPassword({...eventPassword, [event.target.id]: event.target.value});
    }

    const onChangeEventDto = (event: React.ChangeEvent<HTMLInputElement>) => {
        const eventDto = eventFormDto.event
        const eventFormDtoNew: EventFormDto = {
            ...eventFormDto,
            event: {...eventDto, [event.target.id]: event.target.value}
        };
        setEventFormDto(eventFormDtoNew);
    }

    const onChangeEventDtoDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.value && !REGX_DATE_TIME.test(event.target.value)) return;
            const eventDto = eventFormDto.event
            const eventDate = new MdDate(event.target.value)
            const eventFormDtoNew: EventFormDto = {
                ...eventFormDto,
                event: {...eventDto, [event.target.id]: eventDate}
            };
            setEventFormDto(eventFormDtoNew);
    }

    const onChangeUserProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const existingUserProfile = eventFormDto.userProfile
        const eventFormDtoNew: EventFormDto = {
            ...eventFormDto,
            userProfile: {...existingUserProfile, [event.target.id]: event.target.value}
        };
        setEventFormDto(eventFormDtoNew);
    }

    const onEventProgramChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const [programIdString, fieldName] = formIdBreak(event.target.id)
        const value = event.target.value;

        const modifiedProgram = eventFormDto.programs.map(program => {
            if (program.id === +programIdString) {
                const newProgram: any = {...program};
                newProgram[fieldName] = value;
                return newProgram as EventProgramDto;
            } else {
                return program;
            }
        });
        setEventFormDto({...eventFormDto, programs: modifiedProgram});
    };

    const createEventDtoForm = (eventDto: EventDto) => (
        <div>
            <div>
                <label htmlFor="eventName">Event name:</label>
                <input
                    id="eventName"
                    onChange={onChangeEventDto}
                    required
                    className={errorClass(errors, "event.eventName", errorStyles.formInputError)}
                    value={eventFormDto.event.eventName}
                />
                <Error errors={errors} fieldName="event.eventName"/>
            </div>

            <div>
                <label htmlFor="startDate">Start Date:</label>
                <input
                    id="startDate"
                    onChange={onChangeEventDtoDate}
                    required
                    type="datetime-local"
                    className={errorClass(errors, "event.startDate", errorStyles.formInputError)}
                    value={trimToLength(eventFormDto.event.startDate.isoDate, 16)}
                />
                <Error errors={errors} fieldName="event.startDate"/>
            </div>

            <div>
                <label htmlFor="startDate">End Date:</label>
                <input
                    id="endDate"
                    onChange={onChangeEventDtoDate}
                    type="datetime-local"
                    className={errorClass(errors, "event.endDate", errorStyles.formInputError)}
                    value={trimToLength(eventFormDto.event.endDate?.isoDate, 16)}
                />
                <Error errors={errors} fieldName="event.startDate"/>
            </div>
            <div>
                <label className={checkRadio.checkContainer}>
                    Active event
                    <input type="checkbox" checked={eventDto.active}
                           onChange={onChangeEventActive}/>
                    <span className={checkRadio.checkbox}></span>
                </label>
            </div>
        </div>
    );


    const createUserProfileForm = (userProfile: UserProfileDto) => (
        <div>
            <div>
                <label htmlFor="email">Email: </label>
                <input
                    id="email"
                    onChange={onChangeUserProfile}
                    required
                    className={errorClass(errors, "userProfile.email", errorStyles.formInputError)}
                    value={userProfile.email}/>
                <Error errors={errors} fieldName="userProfile.email"/>
            </div>

            <div>
                <label className={checkRadio.checkContainer}>
                    Create Password
                    <input type="checkbox" checked={createPassword}
                           onChange={onChangeCreatePassword}/>
                    <span className={checkRadio.checkbox}></span>
                </label>
            </div>

            {createPassword && (<>
                <div>
                    <label htmlFor="userPassword">Password: </label>
                    <input
                        id="passwordField"
                        onChange={onChangePassword}
                        className={errorClass(errors, "passwordField", errorStyles.formInputError)}
                        value={eventPassword.passwordField}/>
                    <Error errors={errors} fieldName="passwordField"/>
                </div>
                <div>
                    <label htmlFor="eamil">Confirm Password: </label>
                    <input
                        id="passwordConfirm"
                        onChange={onChangePassword}
                        className={errorClass(errors, "passwordConfirm", errorStyles.formInputError)}
                        value={eventPassword.passwordConfirm}/>
                    <Error errors={errors} fieldName="passwordConfirm"/>
                </div>
            </>)
            }

        </div>
    );

    const createEventProgramForm = (program: EventProgramDto) => (
        <div key={program.id}>
            <div>
                <input
                    id={formIdCreate([`${program.id}`, 'programName'])}
                    onChange={onEventProgramChange}
                    required
                    value={program.programName}/>
            </div>
            <div>
                <a href="#" onClick={() => deleteEventProgram(program.id)}>❌</a>
            </div>
        </div>
    );

    const addEventProgram = (programId: number) => {
        const newEventProgram = defaultEventProgramDto();
        newEventProgram.id = programId;
        newEventProgram.eventId = castStringToNumber(eventId);

        const newEventPrograms = eventFormDto.programs.map(a => a);
        newEventPrograms.push(newEventProgram);
        setEventFormDto({...eventFormDto, programs: newEventPrograms});
    }

    const deleteEventProgram = (programId: number) => {
        const newProgramsArray = eventFormDto.programs.filter(a => a.id !== programId);
        setEventFormDto({...eventFormDto, programs: newProgramsArray});
    }


    return (
        <div>
            <h1>Event</h1>
            {adminUser ? "I am admin." : "I am not admin."}
            {authenticated ? "I am authenticated." : "I am not authenticated."}
            <h2>Event Details</h2>
            {createEventDtoForm(eventFormDto.event)}
            <h2>Admin User</h2>
            {createUserProfileForm(eventFormDto.userProfile)}
            <h2>Event Programs</h2>
            <div>
                <a href="#" onClick={() => addEventProgram(temporaryId--)}>Add Program</a>
            </div>
            {eventFormDto.programs.map(p => createEventProgramForm(p))}
            <div>
                <button onClick={() => navigate(cancelLink)}>Cancel</button>
            </div>
        </div>
    );
}