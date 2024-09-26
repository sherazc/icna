import {FieldError} from "./service-types";

export const findError = (errors: FieldError[], fieldName: string) => errors.find(e => e.fieldName === fieldName);

export const errorClass = (errors: FieldError[], fieldName: string, className: string): string =>
    findError(errors, fieldName) === undefined ? "" : className;
