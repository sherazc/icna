import React from "react";
import type { ErrorDto } from "../../service/service-types";
import { findError } from "../../service/errors-helpers";

interface Props {
    errors: ErrorDto[];
    fieldName: string;
}

export const FieldError: React.FC<Props> = ({errors, fieldName}) => {
    const error = findError(errors, fieldName);
    const hasError = error !== undefined && error !== null;

    return hasError ? (
        <div className="errorField">
            {error.message}
        </div>
    ) : (<></>);

};
