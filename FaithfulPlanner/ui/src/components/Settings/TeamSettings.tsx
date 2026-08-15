import { useContext, useEffect, useState } from "react";
import {
  defaultEmployeeTypeDto,
  defaultTeamDto,
  defaultTeamEmployeeTypeDto,
  FormState,
  ModalType,
  type EmployeeGroupTypesDto,
  type EmployeeTypeDto,
  type ErrorDto,
  type ModalConfig,
  type Pair,
  type TeamDto,
  type TeamEmployeeTypeDto
} from "../../service/service-types";
import { AppContext } from "../../store/context";
import "./TeamSettings.css";
import { touchNumber, touchString } from "../../service/utilities";
import { ErrorForm } from "../common/ErrorForm";
import { Loading } from "../common/Loading";
import { Modal } from "../common/Modal";
import { toScErrorResponses } from "../../service/errors-helpers";

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
  const createEmployeeTypeOptions = (gTypes: EmployeeGroupTypesDto[]): Pair[] => {
    const options: Pair[] = []
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

  const onTeamNameChange = (teamId: number, teamName: string) => {
    if (teamName.length > 100) {
      return;
    }
    const teamsCopy = [...teams];
    const foundTeams = teamsCopy.filter(t => t.id === teamId);
    if (foundTeams.length > 0) {
      foundTeams[0].teamName = teamName;
      setTeams(teamsCopy);
    }
  };

  const onChangeRequiredCount = (teamId: number, teamEmployeeTypeId: number, value: string) => {
    const valueNumber: number = touchNumber(value);
    if (valueNumber < 1 || valueNumber > 100) {
      return;
    }
    const teamsCopy = [...teams];
    const foundTeams = teamsCopy.filter(t => t.id === teamId);
    if (foundTeams.length > 0) {
      const filteredTetArray = foundTeams[0].teamEmployeeTypes.filter(tet => tet.id === teamEmployeeTypeId);
      if (filteredTetArray.length > 0) {
        filteredTetArray[0].requiredCount = touchNumber(value);
      }
      setTeams(teamsCopy);
    }
  };

  const onChangeSelectEmployeeType = (teamId: number, teamEmployeeTypeId: number, value: string) => {
    const teamsCopy = [...teams];
    const foundTeams = teamsCopy.filter(t => t.id === teamId);
    if (foundTeams.length > 0) {
      const filteredTetArray = foundTeams[0].teamEmployeeTypes.filter(tet => tet.id === teamEmployeeTypeId);
      if (filteredTetArray.length > 0) {
        const allEmployeeTypes: EmployeeTypeDto[] = []
        allGroupTypes.forEach(gt => allEmployeeTypes.push(...gt.employeeTypes));
        const foundEmployeeType = allEmployeeTypes.find(et => et.id === touchNumber(value));
        if (foundEmployeeType) {
          filteredTetArray[0].employeeType = foundEmployeeType
        } else {
          filteredTetArray[0].employeeType = defaultEmployeeTypeDto();
        }
      }
      setTeams(teamsCopy);
    }
  };

  const onSave = async () => {
    console.log("saving...", new Date());
    setFormState(FormState.IN_PROGRESS);
    const submitErrors: ErrorDto[] = [];
    // submitErrors.push(...validateEmployeeGroupsForm(groups));
    if (submitErrors.length < 1) {
      try {
        const savedTeams = await clinicApis.teamsSave(authUserToken.companyId, teams);
        setTeams(savedTeams);
        setFormState(FormState.SUCCESSFUL);
      } catch (error) {
        const apiErrors: ErrorDto[] = toScErrorResponses(error);
        submitErrors.push(...apiErrors);
        submitErrors.push({ message: "Failed to save teams." });
        setFormState(FormState.FAILED);
      }
    } else {
      setFormState(FormState.FAILED);
    }
    setErrors(submitErrors);
  };

  const createTeamEmployeeTypeCard = (teamId: number, teamEmployeeType: TeamEmployeeTypeDto) => (
    <div key={teamEmployeeType.id} className="team-employee-type-item">
      <select
        onChange={e => onChangeSelectEmployeeType(teamId, teamEmployeeType.id ?? 0, e.target.value)}
        className={teamEmployeeType.employeeType.id ? "team-type-select" : "team-type-select input-empty"}>
        <option value="">Select Group</option>
        {createEmployeeTypeOptions(allGroupTypes).map(option => (
          <option key={option.key} value={option.key}
            selected={touchString(option.key) === touchString(teamEmployeeType.employeeType.id)}>
            {option.value}
          </option>
        ))}
      </select>
      <input type="number" value={teamEmployeeType.requiredCount}
        className="team-type-count-input"
        onChange={e => onChangeRequiredCount(teamId, teamEmployeeType.id ?? 0, e.target.value)}
      />
      <button className="btn btn-icon btn-remove" type="button" title="Remove"
        onClick={() => onRemoveType(teamId, teamEmployeeType.id ?? 0)}>×</button>
    </div>
  );

  const createTeamCard = (team: TeamDto) => (
    <div key={team.id} className="team-card">
      <div className="team-header">
        <div className="team-title">
          <input type="text" value={team.teamName} placeholder="Team name"
            className={team.teamName.length < 1 ? "team-name-input input-empty" : "team-name-input"}
            onChange={e => onTeamNameChange(team.id ?? 0, e.target.value)} />
        </div>
        <div className="team-actions">
          <button className="btn btn-icon btn-delete" type="button" title="Delete team"
            onClick={() => onDeleteTeam(team.id)}>
            🗑
          </button>
        </div>
      </div>
      <div className="employee-types-section">
        <div className="section-label">Required Employee Types</div>
        {team.teamEmployeeTypes && team.teamEmployeeTypes.length > 0 ? (
          <div className="employee-types-list">
            {team.teamEmployeeTypes.map(employeeType => createTeamEmployeeTypeCard(team.id ?? 0, employeeType))}
          </div>
        ) : (
          <div className="empty-state">Add team's required employee types</div>
        )}
        <button className="btn btn-secondary btn-sm btn-add-type" type="button" title="Add Employee Type"
          onClick={() => onAddType(team.id ?? 0)}>+ Add Type</button>
      </div>
    </div>
  );

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
              <div className="empty-state-container">
                <p>No teams created yet</p>
                <button className="btn btnPrimary" onClick={onAddTeam}>Create First Team</button>
              </div>
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