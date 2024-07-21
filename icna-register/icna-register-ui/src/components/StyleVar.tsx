import React, {CSSProperties, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {registerApis} from "../service/api/ApiRegister";
import {StyleVariable} from "../service/service-types";

interface Props {
    children: React.ReactNode;
}

export const StyleVar: React.FC<Props> = ({children}) => {
    const {eventId} = useParams();
    const [styleVariables, setStyleVariables] = useState<StyleVariable[]>([]);

    useEffect(() => {
        loadStyleVariables()
            .then(() => {});
    }, [eventId])


    const loadStyleVariables = async () => {
        if (!eventId) {
            return;
        }
        const styleVariablesResponse= await registerApis()
            .findStyleVariablesByEventId(eventId);
        setStyleVariables(styleVariablesResponse)
    }

    const objectKeyToCssVar = (vars: StyleVariable[]) => {
        return vars.reduce((acc, key) => {
            // @ts-ignore
            acc[`--${key.styleName}`] = key.styleValue;
            return acc;
        }, {});
    }

    return (
        <div style={objectKeyToCssVar(styleVariables)}>
            {children}
        </div>
    );
};
