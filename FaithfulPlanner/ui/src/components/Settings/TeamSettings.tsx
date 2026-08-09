import { useContext, useEffect, useState } from "react";
import {
  defaultTeamDto,
  FormState,
  type EmployeeGroupTypesDto,
  type ErrorDto,
  type SelectOption,
  type TeamDto,
  type TeamEmployeeTypeDto
} from "../../service/service-types";
import { AppContext } from "../../store/context";
import "./TeamSettings.css";
import { touchString } from "../../service/utilities";
import { ErrorForm } from "../common/ErrorForm";
import { Loading } from "../common/Loading";

interface Props { }

let tempId = -1;
export const TeamSettings: React.FC<Props> = () => {

  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [allGroupTypes, setAllGroupTypes] = useState<EmployeeGroupTypesDto[]>([]);
  const [formState, setFormState] = useState<FormState>(FormState.FRESH);
  const [errors, setErrors] = useState<ErrorDto[]>([]);


  const loadData = async (companyId: number) => {
    const teamsResponse = await clinicApis.teamsGet(companyId);
    setTeams(teamsResponse);

    const gTypes = await clinicApis.getEmployeeGroupsTypes(companyId);
    setAllGroupTypes(gTypes);
  };

  // will be used to create drop down of employee type
  const createEmployeeTypeOptions = (gTypes: EmployeeGroupTypesDto[]): SelectOption[] => {
    const options: SelectOption[] = []
    gTypes.forEach(gType => {
      const groupName = gType.groupName
      gType.employeeTypes.forEach(eType => {
        const eTypeId = eType.id;
        const eTypeName = eType.typeName;
        options.push({
          key: touchString(eTypeId),
          value: `${groupName} - ${eTypeName}`
        });
      })
    });
    return options;
  };

  useEffect(() => {
    if (authUserToken && authUserToken.companyId) {
      loadData(authUserToken.companyId);
    }
  }, [authUserToken]);

  const onAddTeam = () => {
    const teamNew = defaultTeamDto();
    teamNew.id = tempId--;
    const allTeams = [...teams];
    allTeams.push(teamNew);
    setTeams(allTeams);
  };

  const createTeamEmployeeTypeCard = (teamEmployeeType: TeamEmployeeTypeDto) => (
    <div>
      <select>
        <option value="">Select Group</option>
        {createEmployeeTypeOptions(allGroupTypes).map(option => (
          <option key={option.key} value={option.key}
            selected={touchString(option.key) === touchString(teamEmployeeType.employeeType.id)}>
            {option.value}
          </option>
        ))}
      </select>
      <input type="number" value={teamEmployeeType.requiredCount} />
      <button type="button" title="Remove">✕</button>
    </div>
  );

  const createTeamCard = (team: TeamDto) => (
    <div>
      <div>
        <div>
          {team.teamName}
        </div>
        <div>
          <button type="button" title="Delete team">🗑</button>
        </div>
      </div>
      {team.teamEmployeeTypes && team.teamEmployeeTypes.length > 0 ?
        (team.teamEmployeeTypes.map(employeeType => createTeamEmployeeTypeCard(employeeType))) : (
          <div>No Team Employee types</div>
        )}
        <div>
          <button type="button" title="Add Employee Type">+ Add Type</button>
        </div>
    </div>
  );

  const onSave = async () => {
    console.log("saving", new Date());
  };

  return (
    <>
      <div className="card team-settings">
        <div className="settings-header">
          <h2>Teams</h2>
          <button className="btn btnPrimary btn-sm" onClick={onAddTeam}>+ Add Team</button>
        </div>
        <ErrorForm formState={formState} errors={errors} />
        <Loading formState={formState} />

        <div className="groups-container">
          {teams && teams.length > 0 ?
            (teams.map(team => createTeamCard(team))) : (
              <div>No Teams</div>
            )}
        </div>
        <Loading formState={formState} />
        <div className="settings-footer">
          <button className="btn btnPrimary btn-lg" onClick={() => onSave()}>Save All Teams</button>
        </div>
      </div>

    </>
  );
}