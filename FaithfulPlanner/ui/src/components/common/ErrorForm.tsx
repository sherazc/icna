import React from "react";
import { FormState, type ErrorDto } from "../../service/service-types";
import { findErrorsForm } from "../../service/errors-helpers";

interface Props {
    errors?: ErrorDto[];
    defaultError?: string;
    formState?: FormState;
}

export const ErrorForm: React.FC<Props> = ({ errors, defaultError, formState}) => {
    if (formState && FormState.FAILED !== formState) return <></>; 

    const errorsForm = findErrorsForm(errors);

    if (FormState.FAILED === formState && defaultError) {
        return (
            <div className="errorMessage">
                {defaultError}
            </div>
        );
    } else if (FormState.FAILED === formState && errorsForm.length > 0) {
        return (
            <div className="errorMessage">
                {errorsForm.map(e => <div>{e.message}</div>)}
            </div>
        );
    } else {
        return <></>;
    }
};
