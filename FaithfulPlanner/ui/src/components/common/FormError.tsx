import React from "react";
import type { ErrorDto } from "../../service/service-types";
import { findFormErrors } from "../../service/errors-helpers";

interface Props {
    errors?: ErrorDto[];
    defaultError?: string;
}


export const FormError: React.FC<Props> = ({errors, defaultError}) => {
    const formErrors = findFormErrors(errors);

    if (defaultError) {
        return (
            <div className="errorField">
            {defaultError}
        </div>
        );
    } else if (formErrors.length > 0) {
        return (
            <div className="errorField">
            {formErrors.map(e => <div>{e.message}</div>)}
        </div>
        );
    }else {
        return <></>;
    }
};
