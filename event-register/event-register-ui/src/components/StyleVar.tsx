import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {StyleVariable} from "../service/service-types";
import {AppContext} from "../store/context";
import {createLoadingActionHide, createLoadingActionShow} from "./Loading";

interface Props {
    children: React.ReactNode;
}

export const StyleVar: React.FC<Props> = ({children}) => {
    const {eventId} = useParams();
    const [styleVariables, setStyleVariables] = useState<StyleVariable[]>([]);
    const [{regApis}, dispatch] = useContext(AppContext);

    useEffect(() => {
        loadStyleVariables()
            .then(() => {
            });
    }, [eventId])


    const loadStyleVariables = async () => {

        const loadingStyles = createLoadingActionShow("Loading Styles");
        dispatch(loadingStyles);
        let styleVariablesResponse;

        if (eventId) {
            styleVariablesResponse = await regApis.findStyleVariablesByEventId(eventId);
        } else {
            styleVariablesResponse = await regApis.getDefaultVariables();
        }
        setStyleVariables(styleVariablesResponse);
        dispatch(createLoadingActionHide(loadingStyles.payload.id));
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
