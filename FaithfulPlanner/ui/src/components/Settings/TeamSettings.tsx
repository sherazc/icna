import { useContext, useEffect, useState } from "react";
import {
  defaultTeamDto,
  FormState,
  type EmployeeGroupTypesDto,
  type ErrorDto,
  type SelectOption,
  type TeamDto
} from "../../service/service-types";
import { AppContext } from "../../store/context";
import "./TeamSettings.css";
import { touchString } from "../../service/utilities";
import { ErrorForm } from "../common/ErrorForm";

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


  return (
    <>
      <div className="card team-settings">
        <div className="settings-header">
          <h2>Teams</h2>
          <button className="btn btnPrimary btn-sm" onClick={onAddTeam}>+ Add Team</button>
        </div>
        <ErrorForm
        // formState={formState} errors={errors} 
        />
        {/* <Loading formState={formState} /> */}

        <div className="groups-container">
      
        </div>
        {/* <Loading formState={formState}/> */}
        <div className="settings-footer">
          <button className="btn btnPrimary btn-lg"
          //onClick={() => onSave()}
          >Save All Teams</button>
        </div>
      </div>
      
    </>
  );
}