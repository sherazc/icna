import { isoDateToJsDate } from "./DateService";
import type { EmployeeGroupTypesDto, EmployeeTypeDto, ErrorDto, OperationDayDto, RegistrationDto, UserProfileDto } from "./service-types";
import { isBlankString } from "./utilities";

const EMAIL_REGEX: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const findErrorField = (errors: ErrorDto[], fieldName: string) => errors.find(e => e.field === fieldName);

export const findErrorsForm = (errors?: ErrorDto[]): ErrorDto[] => {
  if (errors === undefined || errors === null) return [];
  return errors.filter(e => !e.field);
};

export const errorClass = (errors: ErrorDto[], fieldName: string, className: string): string =>
  findErrorField(errors, fieldName) === undefined ? "" : className;


const addFieldError = (errors: ErrorDto[], error: ErrorDto) => {
  !errors.find(e => e.field === error.field) && errors.push(error);
};

export const validateRegistrationForm = (registrationDto: RegistrationDto): ErrorDto[] => {
  const errors: ErrorDto[] = [];

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

export const validateSaveEmployeeForm = (employee: UserProfileDto, confirmPassword: string): ErrorDto[] => {
  const errors: ErrorDto[] = [];

  if (isBlankString(employee.firstName)) {
    addFieldError(errors, {
      field: "firstName",
      message: "Invalid first name.",
    });
  }

  if (isBlankString(employee.lastName)) {
    addFieldError(errors, {
      field: "lastName",
      message: "Invalid last name.",
    });
  }

  if (isBlankString(employee.email)) {
    addFieldError(errors, {
      field: "email",
      message: "Invalid email.",
    });
  }

  if (!employee.id) {
    if (!employee.usersPassword || employee.usersPassword.length < 5) {
      addFieldError(errors, {
        field: "usersPassword",
        message: "Invalid password. Password must be 5 or more characters long.",
      });
    } else if (employee.usersPassword && employee.usersPassword !== confirmPassword) {
      addFieldError(errors, {
        field: "confirmPassword",
        message: "Password and confirm password do not match.",
      });
    }
  }

  return errors;
};


export const toScErrorResponses = (error: unknown, fallbackError?: string): ErrorDto[] => {
  if (!error && fallbackError) return [{ message: fallbackError }];
  if (!error && !fallbackError) return [];

  let errorObject = error;
  if (typeof error === 'string') {
    try {
      errorObject = JSON.parse(error);
    } catch (parseError) {
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
    (typeof (item as any).field === 'string' || (item as any).field === undefined || (item as any).field === null) &&
    (typeof (item as any).message === 'string' || (item as any).message === undefined) &&
    (typeof (item as any).message === 'string' || typeof (item as any).field === 'string')
  );

  if (canTypeCast) {
    return errorObject as ErrorDto[];
  } else {
    // printing the error in console. Not showing it to user.
    console.error(errorObject)
    return [{ message: fallbackError }]
  }
};

export const validateEmployeeGroupsForm = (groups: EmployeeGroupTypesDto[]): ErrorDto[] => {
  const errors: ErrorDto[] = [];
  const types: EmployeeTypeDto[] = [];
  groups.forEach((g) => {
    types.push(...g.employeeTypes)
  });

  const emptyGroupNameIndex = groups.findIndex(g => !g.groupName || g.groupName.length < 1);
  if (emptyGroupNameIndex > -1) {
    errors.push({message: "Employee group name can not be empty."})
  }

  const emptyTypeNameIndex = types.findIndex(t => !t.typeName || t.typeName.length < 1);
  if (emptyTypeNameIndex > -1) {
    errors.push({message: "Employee type name can not be empty."})
  }
  return errors;
};

export const validateSaveOperationDayForm = (operationDay: OperationDayDto): ErrorDto[] => {
  const errors: ErrorDto[] = [];
  const serviceDate = isoDateToJsDate(operationDay.serviceDateString);
  if (serviceDate) {
    const today = new Date();
    if (!operationDay.id && serviceDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
      errors.push({message: "Operation date can not be in past."})
    }
  }
  return errors;
};