import { useContext, useState } from "react";
import type { OpDayDetailEmployeeGroupDto, UserProfileDto } from "../../service/service-types";
import { AppContext } from "../../store/context";

interface Props {
  companyId: number,
  group: OpDayDetailEmployeeGroupDto,
  operationDayId: number
}

export const AssignedUsers: React.FC<Props> = ({ companyId, operationDayId, group }) => {
  const [{ clinicApis }] = useContext(AppContext);
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const [unscheduledUsers, setUnscheduledUsers] = useState<UserProfileDto[]>([]);
  const [filter, setFilter] = useState<string>("");

  const onClickDropDown = async () => {
    if (dropDownOpen) {
      // Closing
      setDropDownOpen(false);
    } else {
      // Opening
      setDropDownOpen(true);
      const unscheduledUsersResponse = await clinicApis.usersScheduled(companyId, group.id, operationDayId, false);
      setUnscheduledUsers(unscheduledUsersResponse);
    }
  };


  return (
    <div className="detailSection">
      <h4 className="detailSectionTitle">Assigned {group.groupName}</h4>
      <div className="cardStat">
        <span className="cardStatLabel">Total Assigned</span>
        <span className="cardStatValue" id="detail-providers-count">{group.users.length}</span>
      </div>
      <div className="mt-15 searchWrapper">
        <div className="searchInputContainer">
          <input type="text" id="provider-search" placeholder="Search and add..." className="searchInput" />
          <div id="provider-dropdown" className={`searchDropdown ${dropDownOpen ? "show": "" }`}>test</div>
        </div>
        <button type="button" className="dropdownToggleBtn" 
        data-onclick="toggleAllProviders()"  
        onClick={onClickDropDown}
        title="Show all">▼</button>
      </div>
      <div>
        <h5 className="cardStatLabel mt-15 mb-1fullWidth">Assigned List</h5>
        <ul className="personList" id="detail-providers-list">
          {group.users.length < 1 && (
            <li className="personItem">
              <span className="personName">No one assigned</span>
            </li>
          )}
          {group.users.length > 0 && group.users.map(u => (
            <li className="personItem" key={u.id}>
              <div className="flex flex-start gap-4 flex-1">
                <span className="personName">{u.firstName} {u.lastName}</span>
                <span className="personRole">
                  {u.types.map(t => t.typeName).join(", ")}
                </span>
              </div>
              <button type="button" className="personRemoveBtn" title="Remove">✕</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}