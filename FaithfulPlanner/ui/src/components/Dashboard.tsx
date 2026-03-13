import { useContext, useState } from "react";
import { defaultOperationDateDto, FormState, ModalType, type ErrorDto, type OperationDateDto } from "../service/service-types";
import { UnAuthRedirect } from "./auth/UnAuthRedirect"
import { ErrorField } from "./common/ErrorField";
import { ErrorForm } from "./common/ErrorForm";
import { Loading } from "./common/Loading";
import { Modal } from "./common/Modal";
import { ScreenHeader } from "./common/ScreenHeader"
import { AppContext } from "../store/context";
import { validateSaveOperationDateForm } from "../service/errors-helpers";

export default function Dashboard() {
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [modalOperationDate, setModalOperationDate] = useState<OperationDateDto>(defaultOperationDateDto());
  const [showOperationDateModal, setShowOperationDateModal] = useState<boolean>(false);
  const [modalOperationDateFormState, setModalOperationDateFormState] = useState<FormState>(FormState.FRESH);
  const [modalOperationDateErrors, setModalOperationDateErrors] = useState<ErrorDto[]>([]);

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setModalOperationDate(prevData => ({ ...prevData, [id]: value }));
  };

  const onNewOperationDate = () => {
    console.log(`New Operation Date`);
    setModalOperationDateFormState(FormState.FRESH)
    setModalOperationDate({ ...defaultOperationDateDto(), companyId: authUserToken.companyId });
    setModalOperationDateErrors([])
    setShowOperationDateModal(true);
  };


  const onModalOprationDateSave = (operationDate: OperationDateDto) => {
      const save = async (groupId: number, operationDate: OperationDateDto) => {
        setModalOperationDateFormState(FormState.IN_PROGRESS);
        const submitErrors: ErrorDto[] = [];
        setModalOperationDateErrors([]);
        const saveOperationDateForm: OperationDateDto = { ...operationDate };
  
        submitErrors.push(...validateSaveOperationDateForm(operationDate));
  
        if (submitErrors.length < 1) {
          try {
            const savedOprationDate = await clinicApis.saveUserProfileOprationDateTypes(touchNumber(saveOperationDateForm.companyId), groupId, saveOperationDateForm);
            console.log(savedOprationDate);
            setModalOprationDateFormState(FormState.SUCCESSFUL);
            setShowModalOprationDateModal(false);
            setModalOprationDate(defaultUserProfileDto());
            const employeesResponse = await clinicApis.getUserProfileOprationDateTypes(authUserToken.companyId, groupId);
            setOprationDates(employeesResponse);
            setConfirmPassword("");
          } catch (error) {
            const apiErrors: ErrorDto[] = toScErrorResponses(error);
            submitErrors.push(...apiErrors);
            submitErrors.push({ message: "Failed to save" });
            setModalOprationDateFormState(FormState.FAILED);
          }
        } else {
          setModalOprationDateFormState(FormState.FAILED);
        }
        setModalOprationDateErrors(submitErrors);
      }
  
      save(touchNumber(employeeGroupId), operationDate);
    };

  return (
    <div id="dashboard">
      <UnAuthRedirect />
      <ScreenHeader screenName="Dashboard">
        <button className="btn btnSecondary" data-onclick="switchScreen('org-selection')">Switch Organization</button>
        <button className="btn btnPrimary" data-onclick="openModal('addClinicModal')"
        onClick={onNewOperationDate}>+ New Clinic Date</button>
      </ScreenHeader>

      <div className="tableContainer">
        <div className="tableScroll">
          <table>
            <thead>
              <tr>
                <th>Clinic Date</th>
                <th>Providers Assigned</th>
                <th>Volunteers Assigned</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr data-onclick="selectRow(this, 'Nov 30, 2025')">
                <td>Nov 30, 2025</td>
                <td>4 <small className="smallText">(Dr. Johnson, Dr. Chen, Dr. Williams, Dr. Martinez)</small></td>
                <td>8 <small className="smallText">(Rodriguez, Thompson, Kim, Anderson +4 more)</small></td>
                <td><span className="badge badgeSuccess">Scheduled</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit" data-onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                  <button className="actionBtn actionBtnDelete" data-onclick="event.stopPropagation()">Delete</button>
                </td>
              </tr>
              <tr data-onclick="selectRow(this, 'Dec 7, 2025')">
                <td>Dec 7, 2025</td>
                <td>3 <small className="smallText">(Dr. Johnson, Dr. Chen, Dr. Brown)</small></td>
                <td>6 <small className="smallText">(Rodriguez, Kim, Garcia, Lee +2 more)</small></td>
                <td><span className="badge badgeSuccess">Scheduled</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit" data-onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                  <button className="actionBtn actionBtnDelete" data-onclick="event.stopPropagation()">Delete</button>
                </td>
              </tr>
              <tr data-onclick="selectRow(this, 'Dec 14, 2025')">
                <td>Dec 14, 2025</td>
                <td>2 <small className="smallText">(Dr. Williams, Dr. Martinez)</small></td>
                <td>4 <small className="smallText">(Thompson, Anderson, Garcia, Johnson)</small></td>
                <td><span className="badge badgeWarning">Pending</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit" data-onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                  <button className="actionBtn actionBtnDelete" data-onclick="event.stopPropagation()">Delete</button>
                </td>
              </tr>
              <tr data-onclick="selectRow(this, 'Dec 21, 2025')">
                <td>Dec 21, 2025</td>
                <td>5 <small className="text-secondary text-sm">(Dr. Johnson, Dr. Martinez, Dr. Smith, Dr. Davis, Dr. Wilson)</small></td>
                <td>10 <small className="text-secondary text-sm">(Rodriguez, Thompson, Kim, Garcia +6 more)</small></td>
                <td><span className="badge badgeSuccess">Scheduled</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit" data-onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                  <button className="actionBtn actionBtnDelete" data-onclick="event.stopPropagation()">Delete</button>
                </td>
              </tr>
              <tr data-onclick="selectRow(this, 'Dec 28, 2025')">
                <td>Dec 28, 2025</td>
                <td>3 <small className="text-secondary text-sm">(Dr. Chen, Dr. Williams, Dr. Brown)</small></td>
                <td>7 <small className="text-secondary text-sm">(Anderson, Lee, Johnson, Miller +3 more)</small></td>
                <td><span className="badge badgeSuccess">Scheduled</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit" data-onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                  <button className="actionBtn actionBtnDelete" data-onclick="event.stopPropagation()">Delete</button>
                </td>
              </tr>
              <tr data-onclick="selectRow(this, 'Jan 4, 2026')">
                <td>Jan 4, 2026</td>
                <td>4 <small className="text-secondary text-sm">(Dr. Johnson, Dr. Martinez, Dr. Taylor, Dr. White)</small></td>
                <td>9 <small className="text-secondary text-sm">(Rodriguez, Kim, Garcia, Thompson +5 more)</small></td>
                <td><span className="badge badgeWarning">Pending</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit" data-onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                  <button className="actionBtn actionBtnDelete" data-onclick="event.stopPropagation()">Delete</button>
                </td>
              </tr>
              <tr data-onclick="selectRow(this, 'Jan 11, 2026')">
                <td>Jan 11, 2026</td>
                <td>2 <small className="text-secondary text-sm">(Dr. Davis, Dr. Wilson)</small></td>
                <td>5 <small className="text-secondary text-sm">(Anderson, Lee, Miller, Clark, Hall)</small></td>
                <td><span className="badge badgeWarning">Pending</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit" data-onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                  <button className="actionBtn actionBtnDelete" data-onclick="event.stopPropagation()">Delete</button>
                </td>
              </tr>
              <tr data-onclick="selectRow(this, 'Jan 18, 2026')">
                <td>Jan 18, 2026</td>
                <td>6 <small className="text-secondary text-sm">(Dr. Johnson, Dr. Chen, Dr. Martinez, Dr. Smith +2 more)</small></td>
                <td>12 <small className="text-secondary text-sm">(Rodriguez, Thompson, Kim, Garcia +8 more)</small></td>
                <td><span className="badge badgePrimary">Draft</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit" data-onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                  <button className="actionBtn actionBtnDelete" data-onclick="event.stopPropagation()">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* <!-- Clinic Day Details Section --> */}
      <div className="card clinicDayDetails">
        <div className="flex flex-start gap-1fullWidth">
          <h3 id="selected-clinic-date" className="m-fullWidth">Select a clinic date to view details</h3>
          <span id="selected-clinic-status" className="badge badgeSuccess hidden"></span>
        </div>

        <div className="detailsGrid">
          {/* <!-- Providers Details --> */}
          <div className="detailSection">
            <h4 className="detailSectionTitle">Assigned Providers</h4>
            <div className="cardStat">
              <span className="cardStatLabel">Total Assigned</span>
              <span className="cardStatValue" id="detail-providers-count">0</span>
            </div>
            <div className="mt-15 searchWrapper">
              <div className="searchInputContainer">
                <input type="text" id="provider-search" placeholder="Search and add providers..." className="searchInput" />
                <div id="provider-dropdown" className="searchDropdown"></div>
              </div>
              <button type="button" className="dropdownToggleBtn" data-onclick="toggleAllProviders()" title="Show all providers">▼</button>
            </div>
            <div>
              <h5 className="cardStatLabel mt-15 mb-1fullWidth">Provider List</h5>
              <ul className="personList" id="detail-providers-list">
                <li className="personItem">
                  <span className="personName">No providers assigned</span>
                </li>
              </ul>
            </div>
          </div>

          {/* <!-- Volunteers Details --> */}
          <div className="detailSection">
            <h4 className="detailSectionTitle">Assigned Volunteers</h4>
            <div className="cardStat">
              <span className="cardStatLabel">Total Assigned</span>
              <span className="cardStatValue" id="detail-volunteers-count">0</span>
            </div>
            <div className="mt-15 searchWrapper">
              <div className="searchInputContainer">
                <input type="text" id="volunteer-search" placeholder="Search and add volunteers..." className="searchInput" />
                <div id="volunteer-dropdown" className="searchDropdown"></div>
              </div>
              <button type="button" className="dropdownToggleBtn" data-onclick="toggleAllVolunteers()" title="Show all volunteers">▼</button>
            </div>
            <div>
              <h5 className="cardStatLabel mt-15 mb-1fullWidth">Volunteer List</h5>
              <ul className="personList" id="detail-volunteers-list">
                <li className="personItem">
                  <span className="personName">No volunteers assigned</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Modal config={{
        title: modalOperationDate.id ? `Edit Clinic Date` : `Add New Clinic Date`,
        yesFunction: () => { console.log(new Date()) },
        modalType: ModalType.DEFAULT,
        yesLabel: "Save",
        noLabel: "Cancel"
      }} show={showOperationDateModal} setShow={setShowOperationDateModal}>
        <form>
          <ErrorForm formState={modalOperationDateFormState} errors={modalOperationDateErrors} />
          <Loading formState={modalOperationDateFormState} />
          <div className="formGroup">
            <label htmlFor="operationDate">Clinic Date</label>
            <input id="operationDate" type="date" onChange={onChangeText}
              value={modalOperationDate.operationDateString} placeholder="Clinic date"/>
            <ErrorField errors={modalOperationDateErrors} fieldName="operationDate" />
          </div>
          <div className="formGroup">
            <label htmlFor="notes">Notes</label>
            <input id="notes" type="text" onChange={onChangeText}
              value={modalOperationDate.notes} placeholder="Notes"/>
            <ErrorField errors={modalOperationDateErrors} fieldName="notes" />
          </div>
        </form>
      </Modal>
    </div>
  );
}