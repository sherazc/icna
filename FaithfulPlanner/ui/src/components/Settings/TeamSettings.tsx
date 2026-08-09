import { useContext, useEffect, useState } from "react";
import {
  defaultTeamDto,
  defaultTeamEmployeeTypeDto,
  FormState,
  ModalType,
  type EmployeeGroupTypesDto,
  type ErrorDto,
  type ModalConfig,
  type SelectOption,
  type TeamDto,
  type TeamEmployeeTypeDto
} from "../../service/service-types";
import { AppContext } from "../../store/context";
import "./TeamSettings.css";
import { touchString } from "../../service/utilities";
import { ErrorForm } from "../common/ErrorForm";
import { Loading } from "../common/Loading";
import { Modal } from "../common/Modal";

interface Props { }

let tempId = -1;
export const TeamSettings: React.FC<Props> = () => {

  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [allGroupTypes, setAllGroupTypes] = useState<EmployeeGroupTypesDto[]>([]);
  const [formState, setFormState] = useState<FormState>(FormState.FRESH);
  const [errors, setErrors] = useState<ErrorDto[]>([]);

  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});
  const [modalMessage, setModalMessage] = useState<string>("");


  const loadData = async (companyId: number) => {
    const teamsResponse = await clinicApis.teamsGet(companyId);
    setTeams(teamsResponse);

    const gTypes = await clinicApis.getEmployeeGroupsTypes(companyId);
    setAllGroupTypes(gTypes);
  };

  // will be used to create drop down of employee type
  // TODO: if a team already have a employee type, then filter out that Employee Type
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
    teamNew.id = --tempId;
    const allTeams = [...teams];
    allTeams.push(teamNew);
    setTeams(allTeams);
  };

  const deleteTeam = (teamId: number) => {
    const filteredTeams = teams.filter(a => a.id !== teamId);
    setTeams(filteredTeams);
  }

  const onDeleteTeam = (teamId?: number) => {
    if (teamId === undefined || teamId === null) {
      return;
    }
    if (teamId < 0) {
      deleteTeam(teamId);
    } else {
      setModalConfig({
        title: "Delete Team",
        modalType: ModalType.WARNING,
        yesLabel: "Ok",
        yesFunction: () => {
          deleteTeam(teamId);
          setModalShow(false);
        },
        noLabel: "Cancel"
      });
      setModalMessage("Are you sure you want to delete? This is will also remove from any operation day it is assigned to.");
      setModalShow(true);
    }
  };

  const onAddType = (teamId: number) => {
    const teamsCopy = [...teams];
    const foundTeams = teamsCopy.filter(t => t.id === teamId);
    if (foundTeams.length > 0) {
      const newTeamEmployeeType = defaultTeamEmployeeTypeDto();
      newTeamEmployeeType.id = --tempId
      foundTeams[0].teamEmployeeTypes.push(newTeamEmployeeType);
      setTeams(teamsCopy);
    }
  };

  const onRemoveType = (teamId: number, teamEmployeeTypeId: number) => {
    const teamsCopy = [...teams];
    const foundTeams = teamsCopy.filter(t => t.id === teamId);
    if (foundTeams.length > 0) {
      const filteredTetArray = foundTeams[0].teamEmployeeTypes.filter(tet => tet.id !== teamEmployeeTypeId);
      foundTeams[0].teamEmployeeTypes = filteredTetArray;
      setTeams(teamsCopy);
    }
  };

  const createTeamEmployeeTypeCard = (teamId: number, teamEmployeeType: TeamEmployeeTypeDto) => (
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
      <button type="button" title="Remove" onClick={() => onRemoveType(teamId, teamEmployeeType.id ?? 0)}>✕</button>
    </div>
  );

  const createTeamCard = (team: TeamDto) => (
    <div>
      <div>
        <div>
          <input type="text" value={team.teamName} />
        </div>
        <div>
          <button type="button" title="Delete team"
            onClick={() => onDeleteTeam(team.id)}>
            🗑
          </button>
        </div>
      </div>
      {team.teamEmployeeTypes && team.teamEmployeeTypes.length > 0 ?
        (team.teamEmployeeTypes.map(employeeType => createTeamEmployeeTypeCard(team.id ?? 0, employeeType))) : (
          <div>Add team's required employee types</div>
        )}
      <div>
        <button type="button" title="Add Employee Type" onClick={() => onAddType(team.id ?? 0)}>+ Add Type</button>
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
          <button className="btn btnPrimary btn-lg" onClick={() => onSave()}>Save Teams</button>
        </div>
      </div>

      <Modal setShow={setModalShow} show={modalShow} config={modalConfig}>
        {modalMessage}
      </Modal>
    </>
  );
}