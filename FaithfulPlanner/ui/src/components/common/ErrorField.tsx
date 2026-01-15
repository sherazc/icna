import React from "react";
import type { ErrorDto } from "../../service/service-types";
import { findErrorField } from "../../service/errors-helpers";

interface Props {
    errors: ErrorDto[];
    fieldName: string;
}

export const ErrorField: React.FC<Props> = ({errors, fieldName}) => {
    const error = findErrorField(errors, fieldName);
    const hasError = error !== undefined && error !== null;

    return hasError ? (
        <div className="errorField">
            {error.message}
        </div>
    ) : (<></>);

};
