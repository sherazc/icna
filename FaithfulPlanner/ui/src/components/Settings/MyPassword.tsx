import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/context";
import {
  defaultPasswordUpdateDto,
  FormState,
  type ErrorDto,
  type PasswordUpdateDto
} from "../../service/service-types";
import { ErrorField } from "../common/ErrorField";
import { Loading } from "../common/Loading";
import { toScErrorResponses, validatePasswordUpdateForm } from "../../service/errors-helpers";
import { ErrorForm } from "../common/ErrorForm";

export const MyPassword = () => {
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [passwordDto, setPasswordDto] = useState<PasswordUpdateDto>(defaultPasswordUpdateDto());
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [formErrors, setFormErrors] = useState<ErrorDto[]>([]);
  const [formState, setFormState] = useState<FormState>(FormState.FRESH);

  useEffect(() => {
    if (authUserToken && authUserToken.userProfileId) {
      passwordDto.userProfileId = authUserToken.userProfileId
    }
  }, [authUserToken]);

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setPasswordDto(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async () => {
    setFormErrors([]);
    const errors: ErrorDto[] = [];
    setFormState(FormState.IN_PROGRESS);
    errors.push(...validatePasswordUpdateForm(passwordDto, confirmPassword));

    if (errors.length < 1) {
      try {
        await clinicApis.passwordUpdate(authUserToken.companyId, passwordDto)
        setPasswordDto(defaultPasswordUpdateDto());
        setFormState(FormState.SUCCESSFUL);
        setConfirmPassword("");
      } catch (error) {
        const apiErrors: ErrorDto[] = toScErrorResponses(error);
        errors.push(...apiErrors);
        errors.push({ message: "Failed to update password" });
        setFormState(FormState.FAILED);
      }
      
    } else {
      setFormState(FormState.FAILED);
    }
    setFormErrors(errors);
  };

  return (
    <div className="card">
      <h3>My Password</h3>
      {formState === FormState.SUCCESSFUL && "Successfully updated password"}
      <ErrorForm formState={formState} errors={formErrors} />
      <Loading formState={formState} />
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="formGroup">
          <label htmlFor="currentPassword">Current Password</label>
          <input id="currentPassword" type="text"
            onChange={onChangeText}
            value={passwordDto.currentPassword}
          />
          <ErrorField errors={formErrors} fieldName="currentPassword" />
        </div>
        <div className="formGroup">
          <label htmlFor="newPassword">New Password</label>
          <input id="newPassword" type="text"
            onChange={onChangeText}
            value={passwordDto.newPassword}
          />
          <ErrorField errors={formErrors} fieldName="userPassword" />
        </div>
        <div className="formGroup">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" type="text" onChange={(event) => setConfirmPassword(event.target.value)}
            value={confirmPassword} />
          <ErrorField errors={formErrors} fieldName="confirmPassword" />
        </div>

        <div>
          <button type="submit" className="btn btnPrimary fullWidth marginTop15">Save</button>
        </div>
      </form>
    </div>
  )
}