import type { ScErrorResponse, RegistrationDto } from "./service-types";
import { isBlankString } from "./utilities";

const EMAIL_REGEX: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const findError = (errors: ScErrorResponse[], fieldName: string) => errors.find(e => e.field === fieldName);

export const errorClass = (errors: ScErrorResponse[], fieldName: string, className: string): string =>
  findError(errors, fieldName) === undefined ? "" : className;


const addFieldError = (errors: ScErrorResponse[], error: ScErrorResponse) => {
  !errors.find(e => e.field === error.field) && errors.push(error);
}

export const validateRegistrationForm = (registrationDto: RegistrationDto): ScErrorResponse[] => {
  const errors: ScErrorResponse[] = [];

  if (isBlankString(registrationDto.company.companyName)) {
    addFieldError(errors, {
      field: "company.companyName",
      message: "Invalid organization name.",
    });
  }

  if (isBlankString(registrationDto.userProfile.email) || !EMAIL_REGEX.test(registrationDto.userProfile.email)) {
    addFieldError(errors, {
      field: "userProfile.email",
      message: "Invalid email address",
    });
  }
  return errors;
};

export const toScErrorResponses = (error: unknown, fallbackError: string): ScErrorResponse[] => {
  if (!error) return [{ message: fallbackError }];

  let errorObject = error;
  if (typeof error === 'string') {
    try {
      errorObject = JSON.parse(error);
    } catch(parseError) {
      errorObject = [{ message: error }];
    }
  } else {
    errorObject = error;
  }

  if (!Array.isArray(errorObject)) {
    errorObject = [errorObject];
  }

  const canTypeCast = (errorObject as any[]).every(item =>
    typeof item === 'object' &&
    item !== null &&
    (typeof (item as any).field === 'string' || (item as any).field === undefined) &&
    (typeof (item as any).message === 'string' || (item as any).message === undefined)
  );

  return canTypeCast ? errorObject as ScErrorResponse[] : [{ message: fallbackError }]
};
