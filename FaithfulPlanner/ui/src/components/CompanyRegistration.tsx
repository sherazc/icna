import { useNavigate } from "react-router-dom";
import { defaultRegistrationDto, FormState, type CompanyDto, type ErrorDto, type FormPassword, type RegistrationDto } from "../service/service-types";
import { useContext, useEffect, useState } from "react";
import { isEqualStrings } from "../service/utilities";
import { ErrorField } from "./common/ErrorField";
import { toScErrorResponses, validateRegistrationForm } from "../service/errors-helpers";
import { AppContext } from "../store/context";
import { ErrorForm } from "./common/ErrorForm";
import { Loading } from "./common/Loading";
import { ActionNameCompany } from "../store/companyReducer";

export default function CompanyRegistration() {
  const navigate = useNavigate();
  const [{ clinicApis }, dispatch] = useContext(AppContext);
  const [registrationDto, setRegistrationDto] = useState<RegistrationDto>(defaultRegistrationDto());
  const [errors, setErrors] = useState<ErrorDto[]>([]);
  const [formState, setFormState] = useState<FormState>(FormState.FRESH);

  const [registrationPassword, setRegistrationPassword] = useState<FormPassword>({
    passwordField: "",
    passwordConfirm: ""
  });

  const register = async () => {
    setFormState(FormState.IN_PROGRESS);
    const submitErrors: ErrorDto[] = [];
    const registrationForm: RegistrationDto = { ...registrationDto };

    submitErrors.push(...validateRegistrationForm(registrationForm));
    submitErrors.push(...validateCreatePassword(registrationPassword));

    if (submitErrors.length < 1) {
      registrationForm.userProfile.usersPassword = registrationPassword.passwordField;
      registrationForm.company.active = true;
      try {
        const savedRegistration = await clinicApis.saveRegistration(registrationForm);
        console.log(savedRegistration);
        setFormState(FormState.SUCCESSFUL);
      } catch (error) {
        const apiErrors: ErrorDto[] = toScErrorResponses(error);
        submitErrors.push(...apiErrors);
        submitErrors.push({ message: "Failed to register" });
        setFormState(FormState.FAILED);
      }
    }
    setErrors(submitErrors);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    register();
  };

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
  };

  const refreshCompanies = async () => {
    try {
      dispatch({
        type: ActionNameCompany.setCompanies,
        payload: await clinicApis.getAllCompanies()
      })
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (formState === FormState.SUCCESSFUL) {
      refreshCompanies();
    }
  }, [formState]);

  const createRegistrationForm = () => (
    <div className="slimContainer">
      <h1>Register Organization</h1>
      <ErrorForm formState={formState} errors={errors} />
      <Loading formState={formState} />
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="companyName">Organization Name</label>
          <input type="text" id="companyName" placeholder="Enter organization name"
            onChange={onChangeCompanyText} />
          <ErrorField errors={errors} fieldName="company.companyName" />
        </div>
        <div className="formGroup">
          <label htmlFor="email">Admin Email</label>
          <input type="email" id="email" placeholder="Primary admin email"
            onChange={onChangeUserProfileText} />
          <ErrorField errors={errors} fieldName="userProfile.email" />
        </div>
        <div className="formGroup">
          <label htmlFor="passwordField">Password</label>
          <input type="password" id="passwordField" placeholder="Enter your password"
            onChange={onChangeText} />
          <ErrorField errors={errors} fieldName="passwordField" />
        </div>
        <div className="formGroup">
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input type="password" id="passwordConfirm" placeholder="Confirm password"
            onChange={onChangeText} />
          <ErrorField errors={errors} fieldName="passwordConfirm" />
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