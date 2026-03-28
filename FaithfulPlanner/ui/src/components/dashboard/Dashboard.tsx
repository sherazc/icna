import { useContext, useEffect, useState } from "react";
import {
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
import { touchNumber } from "../../service/utilities";
import { operationDayDtoToOpDayDetailDto } from "../../service/mapper-types";
import { AssignedUsers } from "./AssignedUsers";

export default function Dashboard() {
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [modalOperationDay, setModalOperationDay] = useState<OperationDayDto>(defaultOperationDayDto());
  const [showOperationDayModal, setShowOperationDayModal] = useState<boolean>(false);
  const [modalOperationDayFormState, setModalOperationDayFormState] = useState<FormState>(FormState.FRESH);
  const [modalOperationDayErrors, setModalOperationDayErrors] = useState<ErrorDto[]>([]);
  const [newOperationDay, setNewOperationDay] = useState<OperationDayDto>();
  const [opDayDetails, setOpDayDetails] = useState<OpDayDetailDto[]>([]);
  const [opDayDetailSelected, setOpDayDetailSelected] = useState<number>(-1);

  const getSelectedDetail = (index: number): OpDayDetailDto | undefined => {
    if (index > -1 && index < opDayDetails.length) {
      return opDayDetails[index];
    }
  };

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setModalOperationDay(prevData => ({ ...prevData, [id]: value }));
  };

  const onNewOperationDay = () => {
    console.log(`New Operation Date`);
    setModalOperationDayFormState(FormState.FRESH)
    setModalOperationDay({ ...defaultOperationDayDto(), companyId: authUserToken.companyId });
    setModalOperationDayErrors([])
    setShowOperationDayModal(true);
  };

  const onModalOperationDateSave = (operationDay: OperationDayDto) => {
    const save = async (operationDay: OperationDayDto) => {
      setModalOperationDayFormState(FormState.IN_PROGRESS);
      const submitErrors: ErrorDto[] = [];
      setModalOperationDayErrors([]);
      const saveOperationDayForm: OperationDayDto = { ...operationDay };
      submitErrors.push(...validateSaveOperationDayForm(saveOperationDayForm));

      if (submitErrors.length < 1) {
        try {
          const savedOperationDay = await clinicApis.operationDaySave(touchNumber(saveOperationDayForm.companyId), saveOperationDayForm);
          setNewOperationDay(savedOperationDay);
          setModalOperationDayFormState(FormState.SUCCESSFUL);
          setShowOperationDayModal(false);
          setModalOperationDay(defaultOperationDayDto());
        } catch (error) {
          const apiErrors: ErrorDto[] = toScErrorResponses(error);
          submitErrors.push({ message: "Failed to save" });
          submitErrors.push(...apiErrors);
          setModalOperationDayFormState(FormState.FAILED);
        }
      } else {
        setModalOperationDayFormState(FormState.FAILED);
      }
      setModalOperationDayErrors(submitErrors);
    }
    save(operationDay);
  };

  const loadOpDetails = async (companyId: number) => {
    // Create filter for it.
    const afterDateString = "2024-01-01";
    const beforeDateString = "2028-01-01";

    const opDayDetailsResponse = await clinicApis.opDayDetailFind(companyId, beforeDateString, afterDateString);
    setOpDayDetails(opDayDetailsResponse)
  };

  const loadEmployeeGroups = async (companyId: number, operationDay: OperationDayDto) => {
    const opDayDetailsCopy = [...opDayDetails];
    const newOpDayDetails = operationDayDtoToOpDayDetailDto(operationDay);
    const employeeGroups: EmployeeGroupDto[] = await clinicApis.getEmployeeGroups(companyId);
    employeeGroups.forEach(eg => {
      newOpDayDetails.groups.push({
        id: touchNumber(eg.id),
        groupName: eg.groupName,
        users: []
      })
    });

    opDayDetailsCopy.push(newOpDayDetails);
    const opDayDetailsSorted = opDayDetailsCopy.sort((a, b) => a.serviceDateString.localeCompare(b.serviceDateString));
    setOpDayDetails(opDayDetailsSorted);
  };

  useEffect(() => {
    loadOpDetails(touchNumber(authUserToken.companyId));
  }, [authUserToken]);

  useEffect(() => {
    if (newOperationDay) {
      loadEmployeeGroups(touchNumber(authUserToken.companyId), newOperationDay);
    }
  }, [newOperationDay, authUserToken]);

  return (
    <div id="dashboard">
      <UnAuthRedirect />
      <ScreenHeader screenName="Dashboard">
        <button className="btn btnSecondary" data-onclick="switchScreen('org-selection')">Switch Organization</button>
        <button className="btn btnPrimary" data-onclick="openModal('addClinicModal')"
          onClick={onNewOperationDay}>+ New Clinic Date</button>
      </ScreenHeader>
      <div className="tableContainer">
        {opDayDetails.length < 1 && "No Data"}
        {opDayDetails.length > 0 &&
          // OpDayDetails grid table
          <div className="tableScroll">
            <table>
              <thead>
                <tr>
                  <th>Clinic Date</th>
                  {opDayDetails[0].groups && opDayDetails[0].groups.map((group) => (
                    <th key={group.id}>{`${group.groupName} Assigned`}</th>
                  ))}
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {opDayDetails.map((opDayDetail, index) => (
                  <tr key={opDayDetail.id} onClick={() => setOpDayDetailSelected(index)} className={opDayDetailSelected === index ? "selected" : ""}>
                    <td>
                      {opDayDetail.serviceDateDayOfWeek}
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
                    <td><span className="badge badgeSuccess">Scheduled</span></td>
                    <td>
                      <button className="actionBtn actionBtnEdit" data-onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                      <button className="actionBtn actionBtnDelete" data-onclick="event.stopPropagation()">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>

      {/* <!-- Day Details --> */}
      <div className="card clinicDayDetails">
        <div className="flex flex-start gap-1fullWidth">
          <h3 id="selected-clinic-date" className="m-fullWidth">
            Day Details: {getSelectedDetail(opDayDetailSelected)?.serviceDateDayOfWeek} {getSelectedDetail(opDayDetailSelected)?.serviceDateFormatted}
          </h3>
          <span id="selected-clinic-status" className="badge badgeSuccess hidden"></span>
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
        title: modalOperationDay.id ? `Edit Clinic Date` : `Add New Clinic Date`,
        yesFunction: () => onModalOperationDateSave(modalOperationDay),
        modalType: ModalType.DEFAULT,
        yesLabel: "Save",
        noLabel: "Cancel"
      }} show={showOperationDayModal} setShow={setShowOperationDayModal}>
        <form>
          <ErrorForm formState={modalOperationDayFormState} errors={modalOperationDayErrors} />
          <Loading formState={modalOperationDayFormState} />
          <div className="formGroup">
            <label htmlFor="serviceDateString">Clinic Date</label>
            <input id="serviceDateString" type="date" onChange={onChangeText}
              value={modalOperationDay.serviceDateString} placeholder="Clinic date" />
            <ErrorField errors={modalOperationDayErrors} fieldName="serviceDateString" />
          </div>
          <div className="formGroup">
            <label htmlFor="notes">Notes</label>
            <input id="notes" type="text" onChange={onChangeText}
              value={modalOperationDay.notes} placeholder="Notes" />
            <ErrorField errors={modalOperationDayErrors} fieldName="notes" />
          </div>
        </form>
      </Modal>
    </div>
  );
}