import { useNavigate } from "react-router-dom";
import { defaultRegistrationDto, FormState, type ErrorDto, type FormPassword, type RegistrationDto } from "../service/service-types";
import { useContext, useState } from "react";
import { isEqualStrings } from "../service/utilities";
import { FieldError } from "./common/FieldError";
import { validateRegistrationForm } from "../service/errors-helpers";
import { AppContext } from "../store/context";

export default function CompanyRegistration() {
  const navigate = useNavigate();
  const [{ clinicApis }] = useContext(AppContext);
  const [registrationDto, setRegistrationDto] = useState<RegistrationDto>(defaultRegistrationDto());
  const [errors, setErrors] = useState<ErrorDto[]>([]);
  const [formState, setFormState] = useState<FormState>(FormState.FRESH);

  const [registrationPassword, setRegistrationPassword] = useState<FormPassword>({
    passwordField: "",
    passwordConfirm: ""
  })


  const register = async () => {
    const submitErrors: ErrorDto[] = [];
    const registrationForm: RegistrationDto = { ...registrationDto };

    submitErrors.push(...validateRegistrationForm(registrationForm));
    submitErrors.push(...validateCreatePassword(registrationPassword));

    if (submitErrors.length < 1) {
      registrationForm.userProfile.usersPassword = registrationPassword.passwordField;
      registrationForm.company.active = true;
      try {
        const savedRegistration = await clinicApis.saveRegistration(registrationForm);
        console.log(savedRegistration)
      } catch (error) {
        console.log(typeof error);
      }

    }

    setErrors(submitErrors);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const status = FormState.IN_PROGRESS;
    setFormState(status);
    register();
  }

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setRegistrationPassword(prevData => ({ ...prevData, [id]: value }));
  };


  const onChangeUserProfileText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setRegistrationDto(prevData => ({
      ...prevData,
      userProfile: { ...prevData.userProfile, [id]: value }
    }));
  };

  const onChangeCompanyText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setRegistrationDto(prevData => ({
      ...prevData,
      company: { ...prevData.company, [id]: value }
    }));
  };

  // TODO move it in Register.tsx helper
  const validateCreatePassword = (registerPass: FormPassword): ErrorDto[] => {
    const passwordRegex: RegExp = /^.{5,}$/;
    const fieldErrors: ErrorDto[] = [];

    if (passwordRegex.test(registerPass.passwordField)) {
      if (!isEqualStrings(registerPass.passwordField, registerPass.passwordConfirm)) {
        fieldErrors.push({
          field: "passwordConfirm",
          message: "Password and confirm password do not match.",
        });
      }
    } else {
      fieldErrors.push({
        field: "passwordField",
        message: "Password should be 5 or more character long.",
      });
    }
    return fieldErrors;
  }


  const createRegistrationForm = () => (
    <div className="slimContainer">
      <h1>Register Organization</h1>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="companyName">Organization Name</label>
          <input type="text" id="companyName" placeholder="Enter organization name"
            onChange={onChangeCompanyText} />
          <FieldError errors={errors} fieldName="company.companyName" />
        </div>
        <div className="formGroup">
          <label htmlFor="email">Admin Email</label>
          <input type="email" id="email" placeholder="Primary admin email"
            onChange={onChangeUserProfileText} />
          <FieldError errors={errors} fieldName="userProfile.email" />
        </div>
        <div className="formGroup">
          <label htmlFor="passwordField">Password</label>
          <input type="password" id="passwordField" placeholder="Enter your password"
            onChange={onChangeText} />
          <FieldError errors={errors} fieldName="passwordField" />
        </div>
        <div className="formGroup">
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input type="password" id="passwordConfirm" placeholder="Confirm password"
            onChange={onChangeText} />
          <FieldError errors={errors} fieldName="passwordConfirm" />
        </div>
        <div className="formActions">
          <button type="submit" className="btn btnPrimary">Register Organization</button>
          <button type="button" className="btn btnSecondary" onClick={() => navigate("/login")}>Back to Login</button>
        </div>
      </form>
    </div>
  );


  const createRegistrationConfirmation = () => (
    <div className="slimContainer">
      <h1>Register Confirmation</h1>
      <div>
        Register Confirmation
      </div>
      <button type="button" className="btn btnPrimary" onClick={() => navigate("/login")}>Back to Login</button>
    </div>
  );


  return (
    <div id="company-registration">
      {formState != FormState.SUCCESSFUL && createRegistrationForm()}
      {formState == FormState.SUCCESSFUL && createRegistrationConfirmation()}
    </div>
  );
}