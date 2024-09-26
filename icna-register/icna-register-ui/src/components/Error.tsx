import React from "react";
import {FieldError} from "../service/service-types";
import {findError} from "../service/errors-helpers";
import styles from "./Error.module.scss";

interface Props {
    errors: FieldError[];
    fieldName: string;
}

export const Error: React.FC<Props> = ({errors, fieldName}) => {
    const error = findError(errors, fieldName);
    const hasError = error !== undefined && error !== null;

    return hasError ? (
        <div className={styles.error}>
            {error.message}
        </div>
    ) : (<></>);

};
