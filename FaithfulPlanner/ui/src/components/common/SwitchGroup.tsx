import type React from "react";
import { useContext, useState } from "react";
import { AppContext } from "../../store/context";
import { touchNumber } from "../../service/utilities";
import { FormState, type ErrorDto, type UserProfileDto } from "../../service/service-types";
import { ErrorForm } from "./ErrorForm";
import { Loading } from "./Loading";
import { toScErrorResponses } from "../../service/errors-helpers";

interface Props {
  userProfile: UserProfileDto;
  onSaveSuccess?: (savedEmployee: UserProfileDto) => void;
  onCancel?: () => void;
}

export const SwitchGroup: React.FC<Props> = ({
  onSaveSuccess,
  onCancel,
  userProfile
}) => {
  const [{ employeeGroups, clinicApis }] = useContext(AppContext);
  const [selectedGroupId, setSelectedGroupId] = useState<number>();
  const [formState, setFormState] = useState<FormState>(FormState.FRESH);
  const [formErrors, setFormErrors] = useState<ErrorDto[]>([]);

  const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedGroupId(touchNumber(value))
  };

  const handleSave = async () => {
    const companyId: number = touchNumber(userProfile.companyId)
    const userId: number = touchNumber(userProfile.id);

    try {
      const savedUser = await clinicApis.switchGroup(companyId, userId, selectedGroupId);
      onSaveSuccess?.(savedUser);
    } catch (error) {
      const apiErrors: ErrorDto[] = toScErrorResponses(error);
      setFormState(FormState.FAILED);
      setFormErrors(apiErrors);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <ErrorForm formState={formState} errors={formErrors} />
      <Loading formState={formState} />

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
            .filter(g => g.id !== userProfile.employeeGroupId)
            .map((group) => (
              <option key={group.id} value={group.id}>{group.groupName}</option>
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
