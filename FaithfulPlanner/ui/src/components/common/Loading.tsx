import React from "react";
import { FormState } from "../../service/service-types";

interface Props {
    message?: string;
    formState: FormState;
}

export const Loading: React.FC<Props> = ({message, formState}) => {
    if (FormState.IN_PROGRESS !== formState) return <></>; 
    return message ? <div className="text-left">{message}</div> : <div className="text-left">loading...</div>
};
