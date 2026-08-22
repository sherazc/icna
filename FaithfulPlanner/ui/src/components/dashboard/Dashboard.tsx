import { useContext, useEffect, useState } from "react";
import {
  defaultOpDayDetailDto,
  FormState,
  ModalType,
  type EmployeeGroupTypesDto,
  type ErrorDto,
  type OpDayDetailDto,
  type OperationDayDto,
  type OperationDayTeamDto,
  type TeamDto
} from "../../service/service-types";
import { UnAuthRedirect } from "../auth/UnAuthRedirect"
import { ErrorField } from "../common/ErrorField";
import { ErrorForm } from "../common/ErrorForm";
import { Loading } from "../common/Loading";
import { Modal } from "../common/Modal";
import { ScreenHeader } from "../common/ScreenHeader"
import { AppContext } from "../../store/context";
import { toScErrorResponses, validateSaveOperationDayForm } from "../../service/errors-helpers";
import { touchNumber, touchString } from "../../service/utilities";
import { opDayDetailDtoToOperationDayDto, operationDayDtoToOpDayDetailDto } from "../../service/mapper-types";
import { AssignedUsers } from "./AssignedUsers";
import "./Dashboard.css"
import { isoToDayOfWeek, isoToMonthDayYear } from "../../service/DateService";
// import { useNavigate } from "react-router-dom";
import { Authenticated } from "../auth/Authenticated";

let tempId = -1;
export default function Dashboard() {
  // const navigate = useNavigate();
  const [{ authUserToken, clinicApis, employeeGroups }] = useContext(AppContext);

  // Selected OpDayDetail index
  const [opDayDetailSelected, setOpDayDetailSelected] = useState<number>(-1);

  // All OpDayDetail array
  const [opDayDetails, setOpDayDetails] = useState<OpDayDetailDto[]>([]);

  // Create Edit Modal
  const [modalOpDayDetail, setModalOpDayDetail] = useState<OpDayDetailDto>(defaultOpDayDetailDto());
  const [showOpDayDetail, setShowOpDayDetail] = useState<boolean>(false);
  const [modalOpDayDetailFormState, setModalOpDayDetailFormState] = useState<FormState>(FormState.FRESH);
  const [modalOpDayDetailErrors, setModalOpDayDetailErrors] = useState<ErrorDto[]>([]);
  const [allGroupTypes, setAllGroupTypes] = useState<EmployeeGroupTypesDto[]>([]);
  const [allTeams, setAllTeams] = useState<TeamDto[]>([]);

  // Delete Modal
  const [modalDeleteOpDayDetail, setModalDeleteOpDayDetail] = useState<OpDayDetailDto>(defaultOpDayDetailDto());
  const [modalDeleteShow, setModalDeleteShow] = useState<boolean>(false);
  const [modalDeleteFormState, setModalODeleteFormState] = useState<FormState>(FormState.FRESH);
  const [modalDeleteErrors, setModalDeleteErrors] = useState<ErrorDto[]>([]);

  // Team employee types accordion (Create/Edit modal)
  const [expandedTeamIds, setExpandedTeamIds] = useState<number[]>([]);

  const onToggleTeamExpanded = (teamId: number) => {
    setExpandedTeamIds(previousIds =>
      previousIds.includes(teamId)
        ? previousIds.filter(id => id !== teamId)
        : [...previousIds, teamId]
    );
  };

  const getSelectedDetail = (index: number): OpDayDetailDto | undefined => {
    if (index > -1 && index < opDayDetails.length) {
      return opDayDetails[index];
    }
  };

  const onDeleteOpDayDetail = (opDayDetail: OpDayDetailDto) => {
    setModalDeleteOpDayDetail(opDayDetail)
    setModalODeleteFormState(FormState.FRESH);
    setModalDeleteErrors([]);
    setModalDeleteShow(true);
  };

  const deleteOpDayDetail = async (companyId: number, operationDayId: number) => {
    const submitErrors: ErrorDto[] = [];
    setModalODeleteFormState(FormState.IN_PROGRESS);
    try {
      clinicApis.operationDayDelete(companyId, operationDayId);
      setModalODeleteFormState(FormState.IN_PROGRESS);
      const filteredOpDayDetails = opDayDetails.filter(o => o.id !== operationDayId);
      setOpDayDetails(filteredOpDayDetails);
      setModalDeleteShow(false);
    } catch (error) {
      const apiErrors: ErrorDto[] = toScErrorResponses(error);
      submitErrors.push({ message: "Failed to save" });
      submitErrors.push(...apiErrors);
      setModalODeleteFormState(FormState.FAILED);
    }
    setModalDeleteErrors(submitErrors);
  };

  const buildTeamColumn = (team: TeamDto, opDayDetail: OpDayDetailDto) => {
    const requiredTeam: OperationDayTeamDto | undefined = opDayDetail.requiredOperationDayTeams.find(rt => rt.team.id === team.id);
    const teamId = touchNumber(team.id);
    const isRequired = requiredTeam !== undefined;
    const isExpanded = expandedTeamIds.includes(teamId);
    return (
      <div className={`opTeamCard${isRequired ? " opTeamCardActive" : ""}`}>
        <div className="opTeamCardHeader">
          <label className="checkboxLabel opTeamCheckboxLabel">
            <input type="checkbox" checked={isRequired} onChange={e => onChangeRequiredTeam(team, e.target.checked, opDayDetail)} />
            <span>{team.teamName}</span>
          </label>
          <input type="number"
            className="opTeamCountInput"
            min={1}
            disabled={!isRequired}
            value={requiredTeam?.requiredTeamCount ?? ""}
            onChange={e => onChangeRequiredTeamCount(team, e.target.value, opDayDetail)}
            placeholder="# of teams" />
          <button
            type="button"
            className="opTeamAccordionToggle"
            aria-expanded={isExpanded}
            onClick={() => onToggleTeamExpanded(teamId)}>
            <span className={`opTeamAccordionIcon${isExpanded ? " opTeamAccordionIconOpen" : ""}`}>▸</span>
          </button>
        </div>
        <div className={`opTeamAccordionBody${isExpanded ? " opTeamAccordionBodyOpen" : ""}`}>
          <div className="opTeamAccordionBodyInner">
            {team.teamEmployeeTypes.length > 0 ? team.teamEmployeeTypes.map(tet => (
              <div key={tet.id} className="opTeamEmployeeTypeRow">
                {/* Use allGroupTypes to pull the group name. Search by tet.employeeType.id */}
                <span className="opTeamEmployeeTypeName">{`${tet.employeeType.typeName} - (TBD - Add Group Name)`}</span>
                <span className="badge badgePrimary">{tet.requiredEmployeeTypeCount}</span>
              </div>
            )) : (
              <div className="opTeamEmployeeTypeEmpty">No employee types configured for this team.</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const onChangeRequiredTeam = (team: TeamDto, checked: boolean, opDayDetail: OpDayDetailDto) => {
    const newOpDayDetail: OpDayDetailDto = { ...opDayDetail };
    if (checked) {
      const operationDayTeam: OperationDayTeamDto = {
        id: --tempId,
        requiredTeamCount: 1,
        team: team
      };
      newOpDayDetail.requiredOperationDayTeams = [...newOpDayDetail.requiredOperationDayTeams];
      newOpDayDetail.requiredOperationDayTeams.push(operationDayTeam);
    } else {
      newOpDayDetail.requiredOperationDayTeams = newOpDayDetail.requiredOperationDayTeams.filter(rt => rt.team.id !== team.id);
    }
    setModalOpDayDetail(newOpDayDetail);
  };

  const onChangeRequiredTeamCount = (team: TeamDto, value: string, opDayDetail: OpDayDetailDto) => {
    const newOpDayDetail: OpDayDetailDto = { ...opDayDetail };
    newOpDayDetail.requiredOperationDayTeams = [...newOpDayDetail.requiredOperationDayTeams];
    const opDayTeam: OperationDayTeamDto | undefined = newOpDayDetail.requiredOperationDayTeams.find(rt => rt.team.id === team.id);
    if (opDayTeam) {
      const valueNumber = touchNumber(value);
      opDayTeam.requiredTeamCount = valueNumber < 1 ? 1 : valueNumber
    }
    setModalOpDayDetail(newOpDayDetail);
  }

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setModalOpDayDetail(prevData => ({ ...prevData, [id]: value }));
  };

  const onCreateEditOpDayDetail = async (opDayDetail?: OpDayDetailDto) => {
    if (opDayDetail) {
      setModalOpDayDetail(opDayDetail);
    } else {
      setModalOpDayDetail({ ...defaultOpDayDetailDto(), companyId: authUserToken.companyId });
    }

    if (allTeams.length < 1 || allGroupTypes.length < 1) {
      // Loading all teams on first edit
      setModalOpDayDetailFormState(FormState.IN_PROGRESS);
      const employeeGroupTypesResponse = await clinicApis.getEmployeeGroupsTypes(authUserToken.companyId);
      setAllGroupTypes(employeeGroupTypesResponse);
      const allTeamsResponse = await clinicApis.teamsGet(authUserToken.companyId);
      setAllTeams(allTeamsResponse);
      setModalOpDayDetailFormState(FormState.FRESH);
    } else {
      setModalOpDayDetailFormState(FormState.FRESH);
    }

    setModalOpDayDetailErrors([]);
    setShowOpDayDetail(true);
  };

  const onModalOperationDateSave = async (opDayDetail: OpDayDetailDto) => {
    setModalOpDayDetailFormState(FormState.IN_PROGRESS);
    const submitErrors: ErrorDto[] = [];
    setModalOpDayDetailErrors([]);

    submitErrors.push(...validateSaveOperationDayForm(opDayDetail));
    if (submitErrors.length < 1) {
      try {
        const saveOperationDayDto = opDayDetailDtoToOperationDayDto(opDayDetail);
        // if new then id should be undefined not zero
        saveOperationDayDto.id = saveOperationDayDto.id === undefined || saveOperationDayDto.id < 1 ? undefined : saveOperationDayDto.id;
        const savedOperationDay: OperationDayDto = await clinicApis.operationDaySave(touchNumber(opDayDetail.companyId), saveOperationDayDto);

        const opDayDetailsCopy = [...opDayDetails];
        if (saveOperationDayDto.id) {
          // replace / update
          opDayDetailsCopy.map(op => {
            if (op.id === savedOperationDay.id) {
              op.serviceDateString = touchString(savedOperationDay.serviceDateString);
              op.notes = savedOperationDay.notes;
              op.serviceDateDayOfWeek = isoToDayOfWeek(touchString(savedOperationDay.serviceDateString));
              op.serviceDateFormatted = isoToMonthDayYear(touchString(savedOperationDay.serviceDateString));
              // if (savedOperationDay.requiredEmployeeTypes) {
              //   op.requiredEmployeeTypes = [...savedOperationDay.requiredEmployeeTypes];
              // }
            }
          })
        } else {
          // push / new
          const newOpDayDetails = operationDayDtoToOpDayDetailDto(savedOperationDay, employeeGroups);
          opDayDetailsCopy.push(newOpDayDetails);
        }
        sortAndSetOpDayDetails(opDayDetailsCopy);
        setModalOpDayDetailFormState(FormState.SUCCESSFUL);
        setShowOpDayDetail(false);
        setModalOpDayDetail(defaultOpDayDetailDto());
      } catch (error) {
        const apiErrors: ErrorDto[] = toScErrorResponses(error);
        submitErrors.push({ message: "Failed to save" });
        submitErrors.push(...apiErrors);
        setModalOpDayDetailFormState(FormState.FAILED);
      }
    } else {
      setModalOpDayDetailFormState(FormState.FAILED);
    }
    setModalOpDayDetailErrors(submitErrors);
  };

  const loadOpDetails = async (companyId: number) => {
    // Create filter for it.
    const afterDateString = "2024-01-01";
    const beforeDateString = "2028-01-01";

    const opDayDetailsResponse = await clinicApis.opDayDetailFind(companyId, beforeDateString, afterDateString);
    setOpDayDetails(opDayDetailsResponse);
  };

  const sortAndSetOpDayDetails = (opDayDetailArray: OpDayDetailDto[]) => {
    const opDayDetailsSorted = opDayDetailArray.sort((a, b) => (a.serviceDateString ?? "").localeCompare(b.serviceDateString ?? ""));
    setOpDayDetails(opDayDetailsSorted);
  };

  const reloadOpDayDetail = (companyId: number, operationDayId: number) => {
    const reload = async () => {
      const opDayDetail = await clinicApis.opDayDetailGet(companyId, operationDayId);
      const opDayDetailsUpdated = opDayDetails.map(op => op.id === opDayDetail.id ? opDayDetail : op);
      setOpDayDetails(opDayDetailsUpdated);
    };
    reload();
  };

  useEffect(() => {
    loadOpDetails(touchNumber(authUserToken.companyId));
  }, [authUserToken]);

  /**
   * This is put in place for the new Company that have no employee group.
   * 
   * The application navigates user to /settings so that user can create employee group.
   * 
   * Employee groups are loaded asynchronously. This effect is triggered before employee groups are loaded.
   * 
   * Because of that on page refresh and after login UI is navigating to /settings even though there are employee groups in the company.
   * 
   * Possible fix: Add some type of loading flag on employee groups. Trigger this effect when employee groups are loaded employee groups are being loaded. 
   */
  /*
  useEffect(() => {
    if (employeeGroups.length < 1) {
      navigate("/settings");
    }
  }, [employeeGroups]);
  */
  return (
    <div id="dashboard">
      <UnAuthRedirect />
      <ScreenHeader screenName="Dashboard">
        <Authenticated shouldHaveRoles={["ADMIN"]}>
          {employeeGroups.length > 0 && (
            <button className="btn btnPrimary" onClick={() => onCreateEditOpDayDetail()}>+ New Date</button>
          )}
        </Authenticated>
      </ScreenHeader>
      <div className="tableContainer">
        {employeeGroups.length < 1 && (
          <div className="padding-20">
            <div className="errorMessage">
              No employee groups found. Navigate to settings page and create employee group.
            </div>
          </div>
        )}
        {employeeGroups.length > 0 && opDayDetails.length < 1 && (
          <div className="padding-20">
            There are operation dates found. Click New button to schedule a new operation data.
          </div>
        )}
        {opDayDetails.length > 0 &&
          // OpDayDetails grid table
          <div className="tableScroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Team</th>
                  {opDayDetails[0].groups && opDayDetails[0].groups.map((group) => (
                    <th key={group.id}>{`${group.groupName}`}</th>
                  ))}
                  <th>Notes</th>
                  <Authenticated shouldHaveRoles={["ADMIN"]}>
                    <th>Actions</th>
                  </Authenticated>
                </tr>
              </thead>
              <tbody>
                {opDayDetails.map((opDayDetail, index) => (
                  <tr key={opDayDetail.id} onClick={() => setOpDayDetailSelected(index)} className={opDayDetailSelected === index ? "selected" : ""}>
                    <td>
                      {opDayDetail.serviceDateDayOfWeek},
                      <br />
                      {opDayDetail.serviceDateFormatted}
                    </td>
                    <td>
                      <small className="smallText">
                        {opDayDetail.requiredOperationDayTeams.map(rt => <>{rt.team.teamName}<br/></>)}
                      </small>
                    </td>
                    {opDayDetail.groups && opDayDetail.groups.map((group) => (
                      <td key={group.id}>
                        {group.users.length}
                        {group.users.length > 0 &&
                          <small className="smallText">
                            {group.users.map(u => (<>{u.firstName} {u.lastName}<br /></>))}
                          </small>
                        }
                      </td>
                    ))}
                    <td>
                      {opDayDetail.notes}
                    </td>
                    <Authenticated shouldHaveRoles={["ADMIN"]}>
                      <td>
                        <button className="actionBtn actionBtnEdit" onClick={() => onCreateEditOpDayDetail(opDayDetail)}>Edit</button>
                        <button className="actionBtn actionBtnDelete" onClick={() => onDeleteOpDayDetail(opDayDetail)}>Delete</button>
                      </td>
                    </Authenticated>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>

      {/* Day Details */}
      {getSelectedDetail(opDayDetailSelected) && (
        <div className="card dashboardDayDetails">
          <div className="flex flex-start gap-1fullWidth">
            <h3 className="m-fullWidth">
              Day Details: {getSelectedDetail(opDayDetailSelected)?.serviceDateDayOfWeek} {getSelectedDetail(opDayDetailSelected)?.serviceDateFormatted}
            </h3>
            <span className="badge badgeSuccess hidden"></span>
          </div>
          <div className="detailsGrid">
            {getSelectedDetail(opDayDetailSelected)?.groups.map(g =>
              <AssignedUsers
                key={g.id}
                companyId={touchNumber(opDayDetails[opDayDetailSelected].companyId)}
                operationDayId={touchNumber(opDayDetails[opDayDetailSelected].id)}
                group={g}
                requiredOperationDayTeams={opDayDetails[opDayDetailSelected].requiredOperationDayTeams}
                reloadOpDayDetail={reloadOpDayDetail} />)}
          </div>
        </div>
      )}
      {/* Delete Modal */}
      <Modal config={{
        title: "Delete Operation Day",
        yesFunction: () => deleteOpDayDetail(touchNumber(modalDeleteOpDayDetail.companyId), touchNumber(modalDeleteOpDayDetail.id)),
        modalType: ModalType.WARNING,
        yesLabel: "Delete",
        noLabel: "Cancel"
      }} show={modalDeleteShow} setShow={setModalDeleteShow}>
        <div>
          <ErrorForm formState={modalDeleteFormState} errors={modalDeleteErrors} />
          <div>Are you sure you want to delete?</div>
          <div>{modalDeleteOpDayDetail.serviceDateDayOfWeek}, {modalDeleteOpDayDetail.serviceDateFormatted}</div>
          {modalDeleteOpDayDetail.groups.map(g => (
            <div key={g.id}>{g.groupName} has {g.users.length} scheduled.</div>
          ))}
        </div>
      </Modal>

      {/* New and Edit Modal */}
      <Modal config={{
        title: modalOpDayDetail.id ? `Edit Operation Date` : `Add New Operation Date`,
        yesFunction: () => onModalOperationDateSave(modalOpDayDetail),
        modalType: ModalType.DEFAULT,
        yesLabel: "Save",
        noLabel: "Cancel"
      }} show={showOpDayDetail} setShow={setShowOpDayDetail}>
        <form>
          <ErrorForm formState={modalOpDayDetailFormState} errors={modalOpDayDetailErrors} />
          <Loading formState={modalOpDayDetailFormState} />
          <div className="formGroup">
            <label htmlFor="serviceDateString">Operation Date</label>
            <input id="serviceDateString" type="date" onChange={onChangeText}
              value={modalOpDayDetail.serviceDateString} placeholder="Operation date" />
            <ErrorField errors={modalOpDayDetailErrors} fieldName="serviceDateString" />
          </div>
          <div className="formGroup">
            <label htmlFor="notes">Notes</label>
            <input id="notes" type="text" onChange={onChangeText}
              value={modalOpDayDetail.notes} placeholder="Notes" />
            <ErrorField errors={modalOpDayDetailErrors} fieldName="notes" />
          </div>
          <div className="formGroup">
            <label>Teams</label>
            <div className="opTeamsList">
              {allTeams.map(t => (
                <div key={t.id}>
                  {buildTeamColumn(t, modalOpDayDetail)}
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}