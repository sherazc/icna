import { useContext, useEffect, useRef, useState } from "react";
import { 
  FormState, 
  type OpDayDetailEmployeeGroupDto, 
  type UserProfileDto 
} from "../../service/service-types";
import { AppContext } from "../../store/context";
import { touchString } from "../../service/utilities";
import "./AssignedUsers.css";

interface Props {
  companyId: number,
  group: OpDayDetailEmployeeGroupDto,
  operationDayId: number
}

export const AssignedUsers: React.FC<Props> = ({ companyId, operationDayId, group }) => {
  const [{ clinicApis }] = useContext(AppContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const [unscheduledUsers, setUnscheduledUsers] = useState<UserProfileDto[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [unscheduledUsersState, setUnscheduledUsersState] = useState<FormState>(FormState.FRESH);

  const resetDropDown = () => {
    setDropDownOpen(false);
    setUnscheduledUsers([]);
    setFilter("");
    setUnscheduledUsersState(FormState.FRESH);
  };

  const onClickDropDown = async () => {
    if (dropDownOpen) {
      // Closing
      setDropDownOpen(false);
    } else {
      // Opening
      setDropDownOpen(true);
      inputRef.current?.focus();
      if (unscheduledUsersState === FormState.SUCCESSFUL || unscheduledUsersState === FormState.FAILED) {
        return;
      }
      setUnscheduledUsersState(FormState.IN_PROGRESS);
      try {
        const unscheduledUsersResponse = await clinicApis.usersScheduled(companyId, group.id, operationDayId, false);
        setUnscheduledUsers(unscheduledUsersResponse);
        setUnscheduledUsersState(FormState.SUCCESSFUL);
      } catch (error) {
        console.log(error);
        setUnscheduledUsersState(FormState.FAILED);
      }
    }
  };

  const getFilteredUnscheduledUsers = (users: UserProfileDto[], f: string): UserProfileDto[] => users.filter(u => {
    const first = touchString(u.firstName).toLowerCase();
    const last = touchString(u.lastName).toLowerCase();
    const full = `${first} ${last}`;
    const filterSmall = f.toLowerCase();

    return first.indexOf(filterSmall) > -1
      || last.indexOf(filterSmall) > -1
      || full.indexOf(filterSmall) > -1
  });

  const populateDropDown = (users: UserProfileDto[], f: string) => {
    if (unscheduledUsersState === FormState.FAILED) {
      return <div className="p-12 text-secondary text-center">Failed to load.</div>;
    }

    if (unscheduledUsersState === FormState.IN_PROGRESS || unscheduledUsersState === FormState.FRESH) {
      return <div className="p-12 text-secondary text-center">Loading...</div>;
    }
    const filteredUsers = getFilteredUnscheduledUsers(users, f);
    if (unscheduledUsersState === FormState.SUCCESSFUL && filteredUsers.length > 0) {
      return filteredUsers.map(u => (
        <div key={u.id} className="searchDropdownItem">
          <div className="dropdownItemInfo">
            <div className="dropdownItemName">{u.firstName} {u.lastName}</div>
            <div className="dropdownItemRole">{u.employeeTypes.map(t => t.typeName).join(", ")}</div>
          </div>
          <button type="button" className="dropdownItemAddBtn" data-onclick="event.stopPropagation();">Add</button>
        </div>
      ));
    } else {
      return <div className="p-12 text-secondary text-center">No results found</div>;
    }
  };

  useEffect(() => {
    resetDropDown()
  }, [operationDayId]);

  return (
    <div className="detailSection">
      <h4 className="detailSectionTitle">Assigned {group.groupName}</h4>
      <div className="cardStat">
        <span className="cardStatLabel">Total Assigned</span>
        <span className="cardStatValue" id="detail-providers-count">{group.users.length}</span>
      </div>
      <div className="mt-15 searchWrapper">
        <div className="searchInputContainer">
          <input type="text" id="provider-search" placeholder="Search and add..." className="searchInput"
            ref={inputRef}
            value={filter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
            onBlur={() => setDropDownOpen(false)}
          />
          <div id="provider-dropdown" className={`searchDropdown ${dropDownOpen ? "show" : ""}`}>
            {populateDropDown(unscheduledUsers, filter)}
          </div>
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
};