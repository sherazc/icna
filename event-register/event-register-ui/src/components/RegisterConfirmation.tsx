import React, {useContext, useEffect, useState} from "react";
import {Link, useParams, useSearchParams} from "react-router-dom";
import {isNotBlankString, touchString} from "../service/utilities";
import {defaultRegistrationDto, RegistrationDto} from "../service/service-types";
import {createLoadingActionHide, createLoadingActionShow} from "./Loading";
import {AppContext} from "../store/context";

interface Props {
}

export const RegisterConfirmation: React.FC<Props> = () => {
    const {eventId, registrationId} = useParams();
    const [newRegSearchParam,] = useSearchParams({"isNew": "false"});
    const newReg = touchString(newRegSearchParam.get("isNew")) === "true";
    const [registration, setRegistration] = useState<RegistrationDto>(defaultRegistrationDto());
    const [{regApis}, dispatch] = useContext(AppContext);

    useEffect(() => {
        if (isNotBlankString(registrationId)) {
            getSavedRegistration(touchString(registrationId));
        }
    }, [eventId, registrationId]);

    const getSavedRegistration = async (savedRegistrationId: string) => {
        const loading = createLoadingActionShow("Saving Registration");
        dispatch(loading)
        const registration = await regApis.findRegistrationByRegistrationId(touchString(registrationId));
        setRegistration(registration)
        dispatch(createLoadingActionHide(loading.payload.id));
    }

    return (
        <div>
            <div><h1>Register Confirmation</h1></div>
            <div>
                Successfully {newReg ? "registered." : "updated registration."}
            </div>
            <div>
                <Link target="_blank"
                      to={`/event/${eventId}/print/register/${registrationId}`}>
                    Print Badges
                </Link>
            </div>
            <div>
                <Link
                    to={`/event/${eventId}/register/${registrationId}`}>
                    Edit Registration.
                </Link>
            </div>

        </div>
    );
};
