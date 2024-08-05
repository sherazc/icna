import React, {useEffect} from "react";
import {useParams} from "react-router-dom";

interface Props {
}

export const RegisterConfirmation: React.FC<Props> = () => {
    const {eventId, registrationId} = useParams();

    useEffect(() => {

    }, [eventId, registrationId]);

    return (
        <div>
            <div><h1>Register Confirmation</h1></div>
        </div>
    );
};
