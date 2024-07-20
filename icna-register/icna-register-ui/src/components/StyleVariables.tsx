import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {registerApis} from "../service/api/ApiRegister";

interface Props {
    children: React.ReactNode;
}

export const StyleVariables: React.FC<Props> = ({children}) => {
    const {eventId} = useParams();

    console.log("EventId", eventId);

    return (
        <div>
            {children}
        </div>
    );
};
