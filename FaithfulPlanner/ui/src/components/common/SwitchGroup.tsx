import "./UserProfileForm.css";
import type React from "react";
import { useContext, useState } from "react";
import { AppContext } from "../../store/context";
import { touchNumber } from "../../service/utilities";

interface Props {
}

export const SwitchGroup: React.FC<Props> = ({ }) => {
  const [{ authUserToken, employeeGroups, clinicApis }] = useContext(AppContext);
  const [selectedGroupId, setSelectedGroupId] = useState<number>();

  const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedGroupId(touchNumber(value))
  };

  const handleSave = async () => {
    console.log("userId", authUserToken.userProfileId);
    console.log("selectedGroupId", selectedGroupId);

    const companyId: number = authUserToken.companyId
    const userId: number = authUserToken.userProfileId;

    try {
      const savedUser = await clinicApis.switchGroup(companyId, userId, selectedGroupId);
      console.log("savedUser", savedUser)
    } catch (error) {

    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <div className="formGroup">
        <label htmlFor="groupId">Organization</label>
        <select id="groupId" onChange={onChangeSelect}>
          <option value="">Select Group</option>
          {employeeGroups.map((group) => (
            <option key={group.id} value={group.id}>{group.groupName}</option>
          ))}
        </select>
      </div>
      <div className="formActions">
        <button type="submit" className="btn btnPrimary">Save</button>
      </div>
    </form>
  );
};
