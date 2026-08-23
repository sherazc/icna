import { useContext, useEffect, useRef, useState } from "react";
import {
  FormState,
  type EmployeeTypeDto,
  type OpDayDetailEmployeeGroupDto,
  type OpDayDetailUserProfileDto,
  type OperationDayTeamDto,
  type ScheduleDto,
  type UserProfileDto
} from "../../service/service-types";
import { AppContext } from "../../store/context";
import { touchNumber, touchString } from "../../service/utilities";
import "./AssignedUsers.css";

interface Props {
  companyId: number,
  group: OpDayDetailEmployeeGroupDto,
  operationDayId: number,
  requiredOperationDayTeams: OperationDayTeamDto[],
  reloadOpDayDetail: (companyId: number, operationDayId: number) => void
}

export const AssignedUsers: React.FC<Props> = ({ companyId, operationDayId, group, reloadOpDayDetail, requiredOperationDayTeams }) => {
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

  const getFilteredUnscheduledUsers = (
    unscheduledUsersArray: UserProfileDto[],
    scheduledUsersArray: OpDayDetailUserProfileDto[],
    filterString: string,
    requiredOpTeams: OperationDayTeamDto[]): UserProfileDto[] => unscheduledUsersArray.filter(unscheduledUser => {

      const first = touchString(unscheduledUser.firstName).toLowerCase();
      const last = touchString(unscheduledUser.lastName).toLowerCase();
      const full = `${first} ${last}`;
      const filterSmall = filterString.toLowerCase();

      const nameMatches = first.indexOf(filterSmall) > -1
        || last.indexOf(filterSmall) > -1
        || full.indexOf(filterSmall) > -1;


      // find required employee types
      const requiredEmployeeTypes: EmployeeTypeDto[] = []
      requiredOpTeams.forEach(requiredOpTeam => {
        for (let i = 0; i < requiredOpTeam.requiredTeamCount; i++) {
          requiredOpTeam.team.teamEmployeeTypes.forEach(teamEmployeeType => {
            for(let j = 0; j < teamEmployeeType.requiredEmployeeTypeCount; j++) {
              requiredEmployeeTypes.push(teamEmployeeType.employeeType);
            }
          });
        }
      });

      // Create sorted available slots (copy of requiredEmployeeTypes)
      const etSlots: EmployeeTypeDto[] = [...requiredEmployeeTypes]
        .sort((s1, s2) => s1.typeName.localeCompare(s2.typeName));

      // Scheduled employee types
      const userEtsArray: EmployeeTypeDto[][] = scheduledUsersArray
          .map(scheduledUser => scheduledUser.types)
          .filter((types: EmployeeTypeDto[]) => types.length > 0)
          .sort((a, b) => a.length - b.length);

      // Remove from slots that are already scheduled.
      userEtsArray.forEach(userEts => {
        const index = etSlots.findIndex(et => userEts.findIndex(userEt => et.id === userEt.id) > -1);
        if (index > -1) {
          etSlots.splice(index, 1);
        }
      });

      // Could unscheduled user be assigned in available slot
      const couldUnscheduledUserBeAssignedInSlot = unscheduledUser.employeeTypes
          .findIndex(unScheduledEt => etSlots.findIndex(etSlot => unScheduledEt.id === etSlot.id) > -1) > -1;
      
      return nameMatches && couldUnscheduledUserBeAssignedInSlot;
    });

  const populateDropDown = (users: UserProfileDto[], filterString: string) => {
    if (unscheduledUsersState === FormState.FAILED) {
      return <div className="p-12 text-secondary text-center">Failed to load.</div>;
    }

    if (unscheduledUsersState === FormState.IN_PROGRESS || unscheduledUsersState === FormState.FRESH) {
      return <div className="p-12 text-secondary text-center">Loading...</div>;
    }

    const filteredUsers = getFilteredUnscheduledUsers(users, group.users, filterString, requiredOperationDayTeams);
    if (unscheduledUsersState === FormState.SUCCESSFUL && filteredUsers.length > 0) {
      return filteredUsers.map(u => (
        <div key={u.id} className="searchDropdownItem">
          <div className="dropdownItemInfo">
            <div className="dropdownItemName">{u.firstName} {u.lastName}</div>
            <div className="dropdownItemRole">{u.employeeTypes.map(t => t.typeName).join(", ")}</div>
          </div>
          <button type="button" className="dropdownItemAddBtn"
            onClick={() => onScheduleUser(companyId, operationDayId, touchNumber(u.id))}>Add</button>
        </div>
      ));
    } else {
      return <div className="p-12 text-secondary text-center">No results found</div>;
    }
  };

  const onScheduleUser = async (companyId: number, operationDayId: number, userProfileId: number) => {
    const schedule: ScheduleDto = { operationDayId, userProfileId };
    await clinicApis.scheduleUser(schedule);
    await reloadOpDayDetail(companyId, operationDayId);
    resetDropDown();
    setDropDownOpen(false);
  }

  const onUnscheduleUser = async (companyId: number, operationDayId: number, userProfileId: number) => {
    await clinicApis.unscheduleUser(operationDayId, userProfileId);
    await reloadOpDayDetail(companyId, operationDayId);
    resetDropDown();
    setDropDownOpen(false);
  }

  useEffect(() => {
    resetDropDown();
  }, [operationDayId]);

  return (
    <div className="detailSection">
      <h4 className="detailSectionTitle">{group.groupName}</h4>
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
          // Because of this Add button does not work. Find another solution.
          // onBlur={() => setDropDownOpen(false)}
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
        <h5 className="cardStatLabel mt-15 mb-1fullWidth">Assigned</h5>
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
                  {u.types && u.types.map(t => t.typeName).join(", ")}
                </span>
              </div>
              <button type="button" className="personRemoveBtn" title="Remove"
                onClick={() => onUnscheduleUser(companyId, operationDayId, u.id)}>✕</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};