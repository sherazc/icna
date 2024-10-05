import {FieldError, RegistrationDto} from "./service-types";
import {isBlankString} from "./utilities";

const EMAIL_REGEX:RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const findError = (errors: FieldError[], fieldName: string) => errors.find(e => e.fieldName === fieldName);

export const errorClass = (errors: FieldError[], fieldName: string, className: string): string =>
    findError(errors, fieldName) === undefined ? "" : className;


const addFieldError = (errors: FieldError[], error: FieldError) => {
    !errors.find(e => e.fieldName === error.fieldName) && errors.push(error);
}

export const validateRegistrationForm = (registrationDto: RegistrationDto): FieldError[] => {
    const errors: FieldError[] = [];

    if (isBlankString(registrationDto.userProfile.email) || !EMAIL_REGEX.test(registrationDto.userProfile.email)) {
        addFieldError(errors, {
            fieldName: "userProfile.email",
            message: "Invalid email address",
        });
    }
    return errors;
}