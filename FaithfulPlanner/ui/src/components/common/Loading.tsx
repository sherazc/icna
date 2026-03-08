import React, { type CSSProperties } from "react";
import { FormState } from "../../service/service-types";

interface Props {
    message?: string;
    formState: FormState;
    className?: string;
    style?: CSSProperties
}

export const Loading: React.FC<Props> = ({style, message, formState}) => {
    if (FormState.IN_PROGRESS !== formState) return <></>; 
    return message ? <div style={style} className="text-left">{message}</div> : <div className="text-left">loading...</div>
};
