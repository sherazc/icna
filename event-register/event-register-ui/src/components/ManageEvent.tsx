import React, {useContext, useState} from "react";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {AppContext} from "../store/context";
import {errorClass} from "../service/errors-helpers";
import errorStyles from "./Error.module.scss";
import {Error} from "./Error";
import {defaultEventFormDto, EventDto, EventFormDto, FieldError, RegistrationDto} from "../service/service-types";
import {FormPassword} from "../service/form-types";
import {registerApis} from "../service/api/ApiRegister";
import checkRadio from "../styles/CheckRadio.module.scss";
import {MdDate, REGX_DATE_TIME} from "../service/DateService";
import {trimToLength} from "../service/utilities";

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

    const onChangeRegistrationPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
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


    return (
        <div>
            <h1>Event</h1>
            {adminUser ? "I am admin." : "I am not admin."}
            {authenticated ? "I am authenticated." : "I am not authenticated."}

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
                        onChange={onChangeRegistrationPassword}
                        className={errorClass(errors, "passwordField", errorStyles.formInputError)}
                        value={eventPassword.passwordField}/>
                    <Error errors={errors} fieldName="passwordField"/>
                </div>
                <div>
                    <label htmlFor="eamil">Confirm Password: </label>
                    <input
                        id="passwordConfirm"
                        onChange={onChangeRegistrationPassword}
                        className={errorClass(errors, "passwordConfirm", errorStyles.formInputError)}
                        value={eventPassword.passwordConfirm}/>
                    <Error errors={errors} fieldName="passwordConfirm"/>
                </div>
            </>)
            }

            <div>
                <label htmlFor="startDate">Event name:</label>
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
                <button onClick={() => navigate(cancelLink)}>Cancel</button>
            </div>
        </div>
    );
}