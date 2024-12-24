import React, {useContext, useEffect, useState} from "react";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {AppContext} from "../store/context";
import {errorClass, validateEventFormDto} from "../service/errors-helpers";
import errorStyles from "./Error.module.scss";
import {Error} from "./Error";
import {
    defaultEventFormDto, defaultEventProgramDto,
    EventDto,
    EventFormDto, EventProgramDto,
    FieldError, StyleVariable,
    UserProfileDto
} from "../service/service-types";
import {FormPassword} from "../service/form-types";
import {registerApis} from "../service/api/ApiRegister";
import checkRadio from "../styles/CheckRadio.module.scss";
import {MdDate, REGX_DATE_TIME} from "../service/DateService";
import {
    castStringToNumber,
    formIdBreak,
    formIdCreate, getDateInputString, isBlankString,
    isEqualStrings
} from "../service/utilities";
import {createLoadingActionHide, createLoadingActionShow} from "./Loading";
import styles from "./ManageEvent.module.scss";
import ColorPicker from "./ColorPicker";

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
    const [defaultStyleVariables, setDefaultStyleVariables] = useState<StyleVariable[]>([]);
    const regApis = registerApis();

    useEffect(() => {
        loadData();
    }, []);

    if (authenticated && !adminUser) {
        return <Navigate to={`/event/${eventId}`}/>
    }


    const loadData = async () => {
        const loadingEvent = createLoadingActionShow("Loading default data");
        dispatch(loadingEvent);

        setDefaultStyleVariables(await regApis.getDefaultVariables());
        if (eventId) {
            setEventFormDto({
                ...eventFormDto,
                event: await regApis.findEventById(eventId),
                styleVariables: await regApis.findStyleVariablesCustomByEventId(eventId),
                programs: await regApis.findProgramsByEventId(eventId),
                adminUserProfile: await regApis.findEventAdmin(eventId)
            });
        }

        dispatch(createLoadingActionHide(loadingEvent.payload.id));
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
        const eventFormDtoNew: EventFormDto = {...eventFormDto};
        const eventDto = eventFormDto.event;
        if (!event.target.value) {
            eventFormDtoNew.event = {...eventDto, [event.target.id]: undefined};
        } else if (REGX_DATE_TIME.test(event.target.value)) {
            const eventDate = new MdDate(event.target.value)
            eventFormDtoNew.event = {...eventDto, [event.target.id]: eventDate};
        }
        setEventFormDto(eventFormDtoNew);
    }

    const onChangeAdminUserProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const existingUserProfile = eventFormDto.adminUserProfile
        const eventFormDtoNew: EventFormDto = {
            ...eventFormDto,
            adminUserProfile: {...existingUserProfile, [event.target.id]: event.target.value}
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
                <label htmlFor="eventName">Event Name </label>
                <input
                    id="eventName"
                    onChange={onChangeEventDto}
                    className={errorClass(errors, "event.eventName", errorStyles.formInputError)}
                    value={eventFormDto.event.eventName}
                />
                <Error errors={errors} fieldName="event.eventName"/>
            </div>

            <div>
                <label htmlFor="startDate">Event Date </label>
                <input
                    id="startDate"
                    onChange={onChangeEventDtoDate}
                    type="datetime-local"
                    className={errorClass(errors, "event.startDate", errorStyles.formInputError)}
                    value={getDateInputString(eventFormDto.event.startDate)}
                />
                <Error errors={errors} fieldName="event.startDate"/>
            </div>

            <div>
                <label htmlFor="startDate">End Date </label>
                <input
                    id="endDate"
                    onChange={onChangeEventDtoDate}
                    type="datetime-local"
                    className={errorClass(errors, "event.endDate", errorStyles.formInputError)}
                    value={getDateInputString(eventFormDto.event.endDate)}
                />
                <Error errors={errors} fieldName="event.endDate"/>
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


    const createAdminUserProfileForm = (adminUserProfile: UserProfileDto) => (
        <div>
            <div>
                <label htmlFor="email">Email </label>
                <input
                    id="email"
                    onChange={onChangeAdminUserProfile}
                    className={errorClass(errors, "adminUserProfile.email", errorStyles.formInputError)}
                    value={adminUserProfile.email}/>
                <Error errors={errors} fieldName="adminUserProfile.email"/>
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
                    <label htmlFor="userPassword">Password </label>
                    <input
                        id="passwordField"
                        onChange={onChangePassword}
                        className={errorClass(errors, "passwordField", errorStyles.formInputError)}
                        value={eventPassword.passwordField}/>
                    <Error errors={errors} fieldName="passwordField"/>
                </div>
                <div>
                    <label htmlFor="eamil">Confirm Password </label>
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

    const createEventProgramForm = (program: EventProgramDto, index: number) => (
        <div key={program.id}>
            <div>
                {index + 1}. <input
                id={formIdCreate([`${program.id}`, 'programName'])}
                onChange={onEventProgramChange}
                className={errorClass(errors, formIdCreate([`${program.id}`, 'programName']), errorStyles.formInputError)}
                value={program.programName}/>
                <Error errors={errors} fieldName={formIdCreate([`${program.id}`, 'programName'])}/>
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

    const validateCreatePassword = (conformPass: boolean, pass: FormPassword): FieldError[] => {
        if (!conformPass) return [];
        const passwordRegex: RegExp = /^.{5,}$/;
        const fieldErrors: FieldError[] = [];

        if (passwordRegex.test(pass.passwordField)) {
            if (!isEqualStrings(pass.passwordField, pass.passwordConfirm)) {
                fieldErrors.push({
                    fieldName: "passwordConfirm",
                    message: "Password and confirm password do not match.",
                });
            }
        } else {
            fieldErrors.push({
                fieldName: "passwordField",
                message: "Password should be 5 or more character long.",
            });
        }
        return fieldErrors;
    }


    const onChangeStyleVariable = (name: string, value: string) => {
        console.log("SV", name, value);

        if (isBlankString(value)) {
            // Remove variable
            setEventFormDto({
                ...eventFormDto, styleVariables:
                    eventFormDto.styleVariables.filter((sv) => sv.styleName !== name)
            });
        } else {
            const newVars = [...eventFormDto.styleVariables];
            let foundIndex = newVars.findIndex(v => v.styleName == name);
            if (foundIndex > -1) {
                // TODO: if the value already exists replace its value
                newVars[foundIndex].styleValue = value;
            } else {
                // TODO: else add it
                const defaultVar = defaultStyleVariables.find(v => v.styleName == name);
                if (defaultVar) {
                    newVars.push({...defaultVar, styleValue: value});
                }
            }
            setEventFormDto({...eventFormDto, styleVariables: newVars});
        }
    }

    const createStyleVariableForm = (styleVariable: StyleVariable, index: number) => {
        const customStyleVariable = eventFormDto.styleVariables?.find(
            v => v.styleName === styleVariable.styleName);
        const customStyleValue = customStyleVariable?.styleValue ? customStyleVariable.styleValue : "";
        return (<tr key={index}>
            <td>{styleVariable.styleName}</td>
            <td>
                <div className={styles.defaultValueContainer}>
                    {styleVariable.styleType === "VAR_COLOR" &&
                        <div className={styles.previewBox} style={{
                            backgroundColor: styleVariable.styleValue.slice(0, 7) || '#FFFFFF',
                        }}></div>}
                    {styleVariable.styleValue}
                </div>
            </td>
            <td>
                {styleVariable.styleType === "VAR_COLOR" &&
                    <ColorPicker
                        name={styleVariable.styleName}
                        value={customStyleValue}
                        onColorChange={onChangeStyleVariable}/>
                }

                {styleVariable.styleType !== "VAR_COLOR" &&
                    <input
                        type="text"
                        name={styleVariable.styleName}
                        value={customStyleValue}
                        onChange={(e) =>
                            onChangeStyleVariable(e.target.name, e.target.value)
                        }
                    />
                }
            </td>
        </tr>);
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const loadingSaving = createLoadingActionShow("Saving Event");
        dispatch(loadingSaving);
        const submitErrors: FieldError[] = [];
        const newEventFormDto: EventFormDto = {...eventFormDto};

        submitErrors.push(...validateEventFormDto(newEventFormDto));
        submitErrors.push(...validateCreatePassword(createPassword, eventPassword));
        // TODO validate style variables regular expression
        console.log(newEventFormDto);

        //
        // registrationForm.id = (!registrationId || registrationId === 'new') ? undefined : +registrationId;
        //
        if (submitErrors.length < 1) {

            // TODO Validate Existing registration. Like email or name already exists.
            // if (newEventFormDto.event.id) {
            //         const existingRegistration = await regApis.findRegistrationByRegistrationId("" + registrationForm.id);
            //         const sameEmail = isEqualStrings(existingRegistration.userProfile.email, registrationForm.userProfile.email);
            //         if (!sameEmail) {
            //             submitErrors.push(...await validateEmailAlreadyExists(eventId, registrationForm.userProfile.email));
            //         }
            //     } else {
            //         submitErrors.push(...await validateEmailAlreadyExists(eventId, registrationForm.userProfile.email));
            //     }
            // }

            // TODO: Create/Update Event
            if (submitErrors.length < 1) {
                if (createPassword) {
                    newEventFormDto.adminUserProfile.userPassword = eventPassword.passwordField;
                }
                // const responseRegistrationDto = await regApis.saveRegistration(eventId as string, registrationForm);
                //
                //     if (responseRegistrationDto.id !== undefined && responseRegistrationDto.id > 0) {
                //         let confirmationUrl = `/event/${eventId}/register-confirmation/${responseRegistrationDto.id}`
                //         confirmationUrl = `${confirmationUrl}?isNew=${registrationForm.id ? 'false' : 'true'}`
                //         navigate(confirmationUrl)
                //     } else {
                //         submitErrors.push({
                //             fieldName: "registrationDto",
                //             message: "Failed to save registration.",
                //         });
            }
        }

        setErrors(submitErrors);
        dispatch(createLoadingActionHide(loadingSaving.payload.id));
    };

    return (
        <form action="#" onSubmit={onSubmit}>
            <div>
                <h1>Event</h1>
                {adminUser ? "I am admin." : "I am not admin."}
                {authenticated ? "I am authenticated." : "I am not authenticated."}
                <h2>Event Details</h2>
                {createEventDtoForm(eventFormDto.event)}
                <h2>Admin User</h2>
                {createAdminUserProfileForm(eventFormDto.adminUserProfile)}
                <h2>Event Programs</h2>
                <div>
                    <a href="#" onClick={() => addEventProgram(temporaryId--)}>Add Program</a>
                </div>
                {eventFormDto.programs.map((p, index) => createEventProgramForm(p, index))}

                <h2>Style Variable</h2>
                <table border={1}>
                    <thead>
                    <tr key="1000">
                        <td>Name</td>
                        <td>Default value</td>
                        <td>Override value</td>
                    </tr>
                    </thead>
                    <tbody>
                    {defaultStyleVariables.map((s, i) => createStyleVariableForm(s, i))}
                    </tbody>
                </table>
                <div>
                    <input type="submit" value="Submit"/>
                    <button onClick={() => navigate(cancelLink)}>Cancel</button>
                </div>
            </div>
        </form>
    );
}