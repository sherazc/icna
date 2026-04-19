import "./UserProfileForm.css";
import type React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../store/context";
import { ErrorField } from "./ErrorField";
import { ErrorForm } from "./ErrorForm";
import { Loading } from "./Loading";
import type { EmployeeGroupTypesDto, EmployeeTypeDto, ErrorDto, FormState, UserProfileDto } from "../../service/service-types";
import { FormState as FormStateEnum } from "../../service/service-types";
import { touchNumber } from "../../service/utilities";
import { toScErrorResponses, validateSaveEmployeeForm } from "../../service/errors-helpers";

interface Props {
  initialUserProfile: UserProfileDto;
  employeeGroupTypes?: EmployeeGroupTypesDto;
  showPasswordFields?: boolean;
  // Callbacks
  onSave?: (handler: () => Promise<void>) => void;
  onSaveSuccess?: (savedEmployee: UserProfileDto) => void;
  onSaveError?: (errors: ErrorDto[]) => void;
}

export const UserProfileForm: React.FC<Props> = ({
  initialUserProfile,
  employeeGroupTypes,
  showPasswordFields = false,
  onSave,
  onSaveSuccess,
  onSaveError,
}) => {
  const { employeeGroupId } = useParams<{ employeeGroupId?: string }>();
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [userProfile, setUserProfile] = useState<UserProfileDto>(initialUserProfile);
  const [formState, setFormState] = useState<FormState>(FormStateEnum.FRESH);
  const [formErrors, setFormErrors] = useState<ErrorDto[]>([]);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const handleSaveRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    setUserProfile(initialUserProfile);
  }, [initialUserProfile]);

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setUserProfile(prevData => ({ ...prevData, [id]: value }));
  };

  const onEmployeeTypeChange = (employeeType: EmployeeTypeDto, isChecked: boolean) => {
    setUserProfile(prevData => {
      const currentTypes = [...prevData.employeeTypes];
      if (isChecked) {
        // Add type if not already present
        if (!currentTypes.some(t => t.id === employeeType.id)) {
          currentTypes.push(employeeType);
        }
      } else {
        // Remove type if unchecked
        return {
          ...prevData,
          employeeTypes: currentTypes.filter(t => t.id !== employeeType.id)
        };
      }
      return { ...prevData, employeeTypes: currentTypes };
    });
  };

  const handleSave = async () => {
    if (!clinicApis || !authUserToken) {
      console.error("Missing required API or auth context");
      return;
    }

    const submitErrors: ErrorDto[] = [];
    setFormErrors([]);
    
    try {
      setFormState(FormStateEnum.IN_PROGRESS);
      const saveEmployeeForm: UserProfileDto = {
        ...userProfile,
        employeeGroupId: touchNumber(employeeGroupId),
      };

      submitErrors.push(...validateSaveEmployeeForm(saveEmployeeForm, confirmPassword));

      if (submitErrors.length < 1) {
        try {
          const savedEmployee = await clinicApis.saveUserProfileEmployeeTypes(
            touchNumber(saveEmployeeForm.companyId),
            saveEmployeeForm
          );
          console.log(savedEmployee);
          setFormState(FormStateEnum.SUCCESSFUL);
          setFormErrors([]);
          setConfirmPassword("");
          onSaveSuccess?.(savedEmployee);
        } catch (error) {
          const apiErrors: ErrorDto[] = toScErrorResponses(error);
          submitErrors.push(...apiErrors);
          submitErrors.push({ message: "Failed to save" });
          setFormState(FormStateEnum.FAILED);
          setFormErrors(submitErrors);
          onSaveError?.(submitErrors);
        }
      } else {
        setFormState(FormStateEnum.FAILED);
        setFormErrors(submitErrors);
        onSaveError?.(submitErrors);
      }
    } catch (error) {
      const apiErrors: ErrorDto[] = toScErrorResponses(error);
      submitErrors.push(...apiErrors);
      setFormState(FormStateEnum.FAILED);
      setFormErrors(submitErrors);
      onSaveError?.(submitErrors);
    }
  };

  useEffect(() => {
    handleSaveRef.current = handleSave;
    onSave?.(handleSave);
  }, [handleSave, onSave]);

  const buildColumn = (types: EmployeeTypeDto[], selectedTypes: EmployeeTypeDto[]) => (
    types.map(t => {
      const isSelected = selectedTypes.some(st => st.id === t.id);
      return (
        <div key={t.id} className="columnItem">
          <label className="checkboxLabel">
            <input
              type="checkbox"
              id={`type-${t.id}`}
              checked={isSelected}
              onChange={(e) => onEmployeeTypeChange?.(t, e.target.checked)}
            />
            <span>{t.typeName}</span>
          </label>
        </div>
      );
    })
  );

  const buildColumns = (groupTypes: EmployeeGroupTypesDto, selectedTypes: EmployeeTypeDto[]) => {
    const middle = groupTypes.employeeTypes.length / 2;
    const column1 = groupTypes.employeeTypes.slice(0, middle);
    const column2 = groupTypes.employeeTypes.slice(middle);

    return (
      <div className="columnsContainer">
        <div className="column">{buildColumn(column1, selectedTypes)}</div>
        <div className="column">{buildColumn(column2, selectedTypes)}</div>
      </div>
    );
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <ErrorForm formState={formState} errors={formErrors} />
      <Loading formState={formState} />

      <div className="formGroup">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" onChange={onChangeText}
          value={userProfile.email} />
        <ErrorField errors={formErrors} fieldName="email" />
      </div>

      {/* Password */}
      {showPasswordFields && <>
        <div className="formGroup">
          <label htmlFor="userPassword">Password</label>
          <input id="userPassword" type="password" onChange={onChangeText}
            value={userProfile.userPassword} />
          <ErrorField errors={formErrors} fieldName="userPassword" />
        </div>
        <div className="formGroup">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" type="password" onChange={(event) => setConfirmPassword(event.target.value)}
            value={confirmPassword} />
          <ErrorField errors={formErrors} fieldName="confirmPassword" />
        </div>
      </>}

      <div className="formGroup">
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" type="text" onChange={onChangeText}
          value={userProfile.firstName} />
        <ErrorField errors={formErrors} fieldName="firstName" />
      </div>
      <div className="formGroup">
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" type="text" onChange={onChangeText}
          value={userProfile.lastName} />
        <ErrorField errors={formErrors} fieldName="lastName" />
      </div>
      <div className="formGroup">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input id="phoneNumber" type="text" onChange={onChangeText}
          value={userProfile.phoneNumber} />
        <ErrorField errors={formErrors} fieldName="phoneNumber" />
      </div>
      {employeeGroupTypes && userProfile.employeeTypes && buildColumns(employeeGroupTypes, userProfile.employeeTypes)}
    </form>
  );
};
