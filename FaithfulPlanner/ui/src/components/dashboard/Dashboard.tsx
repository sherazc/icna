import { useContext, useEffect, useState } from "react";
import {
  defaultOpDayDetailDto,
  defaultOperationDayDto,
  FormState,
  ModalType,
  type EmployeeGroupDto,
  type ErrorDto,
  type OpDayDetailDto,
  type OperationDayDto
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

export default function Dashboard() {
  const [{ authUserToken, clinicApis }] = useContext(AppContext);

  // Selected OpDayDetail index
  const [opDayDetailSelected, setOpDayDetailSelected] = useState<number>(-1);
  const [employeeGroups, setEmployeeGroups] = useState<EmployeeGroupDto[]>([]);

  // All OpDayDetail array
  const [opDayDetails, setOpDayDetails] = useState<OpDayDetailDto[]>([]);

  // Create Modal
  const [modalOpDayDetail, setModalOpDayDetail] = useState<OpDayDetailDto>(defaultOpDayDetailDto());
  const [showOpDayDetail, setShowOpDayDetail] = useState<boolean>(false);
  const [modalOpDayDetailFormState, setModalOpDayDetailFormState] = useState<FormState>(FormState.FRESH);
  const [modalOpDayDetailErrors, setModalOpDayDetailErrors] = useState<ErrorDto[]>([]);

  // Delete Modal
  const [modalDeleteOpDayDetail, setModalDeleteOpDayDetail] = useState<OpDayDetailDto>(defaultOpDayDetailDto());
  const [modalDeleteShow, setModalDeleteShow] = useState<boolean>(false);
  const [modalDeleteFormState, setModalODeleteFormState] = useState<FormState>(FormState.FRESH);
  const [modalDeleteErrors, setModalDeleteErrors] = useState<ErrorDto[]>([]);

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

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setModalOpDayDetail(prevData => ({ ...prevData, [id]: value }));
  };

  const onCreateEditOpDayDetail = (opDayDetail?: OpDayDetailDto) => {
    if (opDayDetail) {
      setModalOpDayDetail(opDayDetail);
    } else {
      setModalOpDayDetail({ ...defaultOpDayDetailDto(), companyId: authUserToken.companyId });
    }
    setModalOpDayDetailFormState(FormState.FRESH);
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
            }
          })
        } else {
          // push / new
          const newOpDayDetails = operationDayDtoToOpDayDetailDto(savedOperationDay, employeeGroups);
          opDayDetailsCopy.push(newOpDayDetails);
        }
        const opDayDetailsSorted = opDayDetailsCopy.sort((a, b) => a.serviceDateString.localeCompare(b.serviceDateString));
        setOpDayDetails(opDayDetailsSorted);
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

    const employeeGroupsResponse: EmployeeGroupDto[] = await clinicApis.getEmployeeGroups(companyId);
    setEmployeeGroups(employeeGroupsResponse);
  };

  useEffect(() => {
    loadOpDetails(touchNumber(authUserToken.companyId));
  }, [authUserToken]);

  return (
    <div id="dashboard">
      <UnAuthRedirect />
      <ScreenHeader screenName="Dashboard">
        <button className="btn btnPrimary" onClick={() => onCreateEditOpDayDetail()}>+ New Date</button>
      </ScreenHeader>
      <div className="tableContainer">
        {opDayDetails.length < 1 && "No Data"}
        {opDayDetails.length > 0 &&
          // OpDayDetails grid table
          <div className="tableScroll">
            <table>
              <thead>
                <tr>
                  <th>Operation Date</th>
                  {opDayDetails[0].groups && opDayDetails[0].groups.map((group) => (
                    <th key={group.id}>{`${group.groupName} Assigned`}</th>
                  ))}
                  <th>Actions</th>
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
                    {opDayDetail.groups && opDayDetail.groups.map((group) => (
                      <td key={group.id}>
                        {group.users.length}
                        {group.users.length > 0 &&
                          <small className="smallText">(
                            {group.users.map((u => `${u.firstName} ${u.lastName}`)).join(", ")}
                            )</small>
                        }
                      </td>
                    ))}
                    <td>
                      <button className="actionBtn actionBtnEdit" onClick={() => onCreateEditOpDayDetail(opDayDetail)}>Edit</button>
                      <button className="actionBtn actionBtnDelete" onClick={() => onDeleteOpDayDetail(opDayDetail)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>

      {/* <!-- Day Details --> */}
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
              group={g} />)}
        </div>
      </div>

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
        </form>
      </Modal>
    </div>
  );
}