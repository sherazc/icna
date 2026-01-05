import { useNavigate } from "react-router-dom";
import { defaultRegistrationDto, type FieldError, type FormPassword, type RegistrationDto } from "../service/service-types";
import { useState } from "react";
import { isEqualStrings } from "../service/utilities";
import { Error } from "./Error";
import { validateRegistrationForm } from "../service/errors-helpers";

export default function CompanyRegistration() {
  const navigate = useNavigate();
  const [registrationDto, setRegistrationDto] = useState<RegistrationDto>(defaultRegistrationDto());
  const [errors, setErrors] = useState<FieldError[]>([]);

  const [registrationPassword, setRegistrationPassword] = useState<FormPassword>({
    passwordField: "",
    passwordConfirm: ""
  })


  const register = async () => {
    console.log(registrationDto);
    console.log(registrationPassword);
    const submitErrors: FieldError[] = [];
    const registrationForm: RegistrationDto = {...registrationDto};

    submitErrors.push(...validateRegistrationForm(registrationForm));
    submitErrors.push(...validateCreatePassword(registrationPassword));

    if (submitErrors.length < 1) {
      // register
    }

    setErrors(submitErrors);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    register();
  }

 const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setRegistrationPassword(prevData => ({ ...prevData, [id]: value }));
  };


  const onChangeUserProfileText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setRegistrationDto(prevData => ({...prevData,
      userProfile: { ...prevData.userProfile, [id]: value }}));
  };

  const onChangeCompanyText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setRegistrationDto(prevData => ({...prevData,
      company: { ...prevData.company, [id]: value }}));
  };

  // TODO move it in Register.tsx helper
  const validateCreatePassword = (registerPass: FormPassword): FieldError[] => {
    const passwordRegex: RegExp = /^.{5,}$/;
    const fieldErrors: FieldError[] = [];

    if (passwordRegex.test(registerPass.passwordField)) {
      if (!isEqualStrings(registerPass.passwordField, registerPass.passwordConfirm)) {
        fieldErrors.push({
          fieldName: "passwordConfirm",
          message: "Password and confirm password do not match.",
        });
      }
    } else {
      fieldErrors.push({
        fieldName: "passwordField",
        message: "Password should be 5 or more character long.",
      });
    }
    return fieldErrors;
  }

  

  return (
    <div id="company-registration">
      <div className="loginContainer">
        <h1>Register Organization</h1>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="companyName">Organization Name</label>
            <input type="text" id="companyName" placeholder="Enter organization name" 
            onChange={onChangeCompanyText}/>
            <Error errors={errors} fieldName="company.companyName"/>
          </div>
          <div className="formGroup">
            <label htmlFor="email">Admin Email</label>
            <input type="email" id="email" placeholder="Primary admin email"
            onChange={onChangeUserProfileText}/>
            <Error errors={errors} fieldName="userProfile.email"/>
          </div>
          <div className="formGroup">
            <label htmlFor="passwordField">Password</label>
            <input type="password" id="passwordField" placeholder="Enter your password"
              onChange={onChangeText} />
            <Error errors={errors} fieldName="passwordField"/>
          </div>
          <div className="formGroup">
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input type="password" id="passwordConfirm" placeholder="Confirm password"
              onChange={onChangeText} />
            <Error errors={errors} fieldName="passwordConfirm"/>
          </div>
          <div className="formActions">
            <button type="submit" className="btn btnPrimary">Register Organization</button>
            <button type="button" className="btn btnSecondary" onClick={() => navigate("/login")}>Back to Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}