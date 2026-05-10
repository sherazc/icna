import type React from "react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/context";
import { touchNumber } from "../../service/utilities";
import { defaultUserProfileDto, FormState, type ErrorDto, type UserProfileDto } from "../../service/service-types";
import { ErrorForm } from "./ErrorForm";
import { Loading } from "./Loading";
import { toScErrorResponses } from "../../service/errors-helpers";

interface Props {
  initialUserProfile: UserProfileDto;
  onSaveSuccess?: (savedEmployee: UserProfileDto) => void;
  onCancel?: () => void;
}

export const SwitchGroup: React.FC<Props> = ({
  initialUserProfile,
  onSaveSuccess,
  onCancel
}) => {
  const [{ employeeGroups, clinicApis }] = useContext(AppContext);
  const [selectedGroupId, setSelectedGroupId] = useState<number>();
  const [formState, setFormState] = useState<FormState>(FormState.FRESH);
  const [formErrors, setFormErrors] = useState<ErrorDto[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileDto>(defaultUserProfileDto());

  const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedGroupId(touchNumber(value))
  };

  const handleSave = async () => {
    setFormState(FormState.IN_PROGRESS)
    const companyId: number = touchNumber(userProfile.companyId)
    const userId: number = touchNumber(userProfile.id);
    setFormErrors([]);

    try {
      const savedUser = await clinicApis.switchGroup(companyId, userId, selectedGroupId);
      onSaveSuccess?.(savedUser);
      setUserProfile(savedUser);
      setFormState(FormState.SUCCESSFUL);
    } catch (error) {
      const apiErrors: ErrorDto[] = toScErrorResponses(error);
      setFormState(FormState.FAILED);
      setFormErrors(apiErrors);
    }
  };

  useEffect(() => {
    if (initialUserProfile) {
      setFormState(FormState.FRESH);
      setUserProfile(initialUserProfile);
    }
  }, [initialUserProfile]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <ErrorForm formState={formState} errors={formErrors} />
      <Loading formState={formState} />
      {formState === FormState.SUCCESSFUL && "Saved!"}

      {userProfile.employeeTypes.length > 0 &&
        <div>
          <strong>Warning: </strong>
          If you switch group, then it will remove all {userProfile.firstName}'s employee types.
          <ul>
            {userProfile.employeeTypes.map(et => (
              <li key={et.id}>{et.typeName}</li>
            ))}
          </ul>
        </div>
      }

      <div className="formGroup">
        <label htmlFor="groupId">Organization</label>
        <select id="groupId" onChange={onChangeSelect} required>
          <option value="">Select Group</option>
          {employeeGroups
            // .filter(g => g.id !== userProfile.employeeGroupId)
            .map((group) => (
              <option key={group.id} value={group.id} selected={group.id === userProfile.employeeGroupId}>{group.groupName}</option>
            ))}
        </select>
      </div>
      <div className="formActions">
        <button type="submit" className="btn btnPrimary">Save</button>
        {onCancel && <button type="button" className="btn btnSecondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};
