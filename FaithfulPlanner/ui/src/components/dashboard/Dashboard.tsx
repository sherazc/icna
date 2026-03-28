import { useContext, useState } from "react";
import { defaultOperationDayDto, FormState, ModalType, type ErrorDto, type OperationDayDto } from "../../service/service-types";
import { UnAuthRedirect } from "../auth/UnAuthRedirect"
import { ErrorField } from "../common/ErrorField";
import { ErrorForm } from "../common/ErrorForm";
import { Loading } from "../common/Loading";
import { Modal } from "../common/Modal";
import { ScreenHeader } from "../common/ScreenHeader"
import { AppContext } from "../../store/context";
import { toScErrorResponses, validateSaveOperationDayForm } from "../../service/errors-helpers";
import { touchNumber } from "../../service/utilities";
import { DashboardDetail } from "./DashboardDetail";

export default function Dashboard() {
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [modalOperationDay, setModalOperationDay] = useState<OperationDayDto>(defaultOperationDayDto());
  const [showOperationDayModal, setShowOperationDayModal] = useState<boolean>(false);
  const [modalOperationDayFormState, setModalOperationDayFormState] = useState<FormState>(FormState.FRESH);
  const [modalOperationDayErrors, setModalOperationDayErrors] = useState<ErrorDto[]>([]);
  const [newOperationDay, setNewOperationDay] = useState<OperationDayDto>();

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

  return (
    <div id="dashboard">
      <UnAuthRedirect />
      <ScreenHeader screenName="Dashboard">
        <button className="btn btnSecondary" data-onclick="switchScreen('org-selection')">Switch Organization</button>
        <button className="btn btnPrimary" data-onclick="openModal('addClinicModal')"
        onClick={onNewOperationDay}>+ New Clinic Date</button>
      </ScreenHeader>
      <DashboardDetail newOperationDay={newOperationDay}/>
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
                   value={modalOperationDay.serviceDateString} placeholder="Clinic date"/>
            <ErrorField errors={modalOperationDayErrors} fieldName="serviceDateString" />
          </div>
          <div className="formGroup">
            <label htmlFor="notes">Notes</label>
            <input id="notes" type="text" onChange={onChangeText}
              value={modalOperationDay.notes} placeholder="Notes"/>
            <ErrorField errors={modalOperationDayErrors} fieldName="notes" />
          </div>
        </form>
      </Modal>
    </div>
  );
}