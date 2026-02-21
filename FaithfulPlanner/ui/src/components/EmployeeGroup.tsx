import type React from "react";
import "./EmployeeGroup.css"
import { useParams } from "react-router-dom";
import { ScreenHeader } from "./common/ScreenHeader";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../store/context";
import {
  defaultEmployeeGroupTypeDto,
  defaultUserProfileDto,
  FormState, ModalType,
  type EmployeeGroupTypesDto,
  type EmployeeTypeDto,
  type ErrorDto,
  type UserProfileDto
} from "../service/service-types"; import { UnAuthRedirect } from "./auth/UnAuthRedirect";
import { Modal } from "./common/Modal";
import { touchNumber } from "../service/utilities";
import { toScErrorResponses, validateSaveEmployeeForm } from "../service/errors-helpers";
import { ErrorField } from "./common/ErrorField";
import { ErrorForm } from "./common/ErrorForm";
import { Loading } from "./common/Loading";

interface Props { }

export const EmployeeGroup: React.FC<Props> = () => {
  const { employeeGroupId } = useParams();
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [employees, setEmployees] = useState<UserProfileDto[]>([]);
  const [employeeGroupTypes, setEmployeeGroupTypes] = useState<EmployeeGroupTypesDto>(defaultEmployeeGroupTypeDto());

  // Delete Employee Modal
  const [showEmployeeDeleteModal, setShowEmployeeDeleteModal] = useState<boolean>(false);
  const [modalEmployeeDelete, setModalEmployeeDelete] = useState<UserProfileDto>(defaultUserProfileDto());

  // Save Employee Modal Form
  const [modalEmployee, setModalEmployee] = useState<UserProfileDto>(defaultUserProfileDto());
  const [showModalEmployeeModal, setShowModalEmployeeModal] = useState<boolean>(false);
  const [modalEmployeeFormState, setModalEmployeeFormState] = useState<FormState>(FormState.FRESH);
  const [modalEmployeeErrors, setModalEmployeeErrors] = useState<ErrorDto[]>([]);
  const [confirmPassword, setConfirmPassword] = useState<string>("");



  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setModalEmployee(prevData => ({ ...prevData, [id]: value }));
  };

  const loadData = async (companyId: number, groupId: number) => {
    const employeesResponse = await clinicApis.getUserProfileEmployeeTypes(companyId, groupId);
    setEmployees(employeesResponse);
    const employeeGroupTypesResponse = await clinicApis.getEmployeeGroupTypes(companyId, groupId);
    setEmployeeGroupTypes(employeeGroupTypesResponse);
  };

  const onNewEmployee = () => {
    console.log(`New employee`);
    setModalEmployee({ ...defaultUserProfileDto(), companyId: authUserToken.companyId });
    setModalEmployeeErrors([])
    setShowModalEmployeeModal(true);
  };

  const onEditModalEmployee = (employee: UserProfileDto) => {
    console.log(`Edit employee ${employee.id}`, employee);
    setModalEmployee(employee);
    setModalEmployeeErrors([])
    setShowModalEmployeeModal(true);
  };

  const onDeleteEmployee = (employee: UserProfileDto) => {
    console.log(`Delete employee ${employee.id}`);
    setModalEmployeeDelete(employee);
    setShowEmployeeDeleteModal(true);
  };

  const onModalEmployeeSave = (employee: UserProfileDto) => {
    const save = async (groupId: number, employee: UserProfileDto) => {
      setModalEmployeeFormState(FormState.IN_PROGRESS);
      const submitErrors: ErrorDto[] = [];
      const saveEmployeeForm: UserProfileDto = { ...employee };

      submitErrors.push(...validateSaveEmployeeForm(saveEmployeeForm, confirmPassword));

      if (submitErrors.length < 1) {
        try {
          const savedEmployee = await clinicApis.saveUserProfileEmployeeTypes(touchNumber(saveEmployeeForm.companyId), groupId, saveEmployeeForm);
          console.log(savedEmployee);
          setModalEmployeeFormState(FormState.SUCCESSFUL);
        } catch (error) {
          const apiErrors: ErrorDto[] = toScErrorResponses(error);
          submitErrors.push(...apiErrors);
          submitErrors.push({ message: "Failed to save" });
          setModalEmployeeFormState(FormState.FAILED);
        }
      } else {
        setModalEmployeeFormState(FormState.FAILED);
      }
      setModalEmployeeErrors(submitErrors);
    }

    save(touchNumber(employeeGroupId), employee);
  };

  useEffect(() => {
    if (employeeGroupId && authUserToken.companyId) {
      loadData(authUserToken.companyId, +employeeGroupId);
    }
  }, [employeeGroupId, authUserToken]);

  const createEmployeeTypes = (employeeTypes: EmployeeTypeDto[]): React.ReactNode => (
    <small className="smallText">{employeeTypes.map(et => et.typeName).join(", ")}</small>
  );

  const createEmployeeRow = (employee: UserProfileDto): React.JSX.Element => (
    <tr key={employee.id}>
      <td>{employee.firstName} {employee.lastName}</td>
      <td>{employee.employeeTypes.length > 0 && createEmployeeTypes(employee.employeeTypes)}</td>
      <td>{employee.email}</td>
      <td>{employee.phoneNumber}</td>
      <td>
        <span className="badge badgeSuccess">Scheduled</span>
        <button className="actionBtn actionBtnEdit" onClick={() => onEditModalEmployee(employee)}>Edit</button>
        <button className="actionBtn actionBtnDelete" onClick={() => onDeleteEmployee(employee)}>Delete</button>
      </td>
    </tr>
  );

  const buildColumns = (groupTypes: EmployeeGroupTypesDto, selectedTypes: EmployeeTypeDto[]) => {
    const middle = groupTypes.employeeTypes.length / 2;
    const column1 = groupTypes.employeeTypes.slice(0, middle);
    const column2 = groupTypes.employeeTypes.slice(middle);

    return (
      <div className="columnsContainer">
        <div className="column">{buildColumn(column1, selectedTypes)}</div>
        <div className="column">{buildColumn(column2, selectedTypes)}</div>
      </div>
    );
  };

  const onEmployeeTypeChange = (employeeType: EmployeeTypeDto, isChecked: boolean) => {
    setModalEmployee(prevData => {
      const currentTypes = [...prevData.employeeTypes];
      if (isChecked) {
        // Add type if not already present
        if (!currentTypes.some(t => t.id === employeeType.id)) {
          currentTypes.push(employeeType);
        }
      } else {
        // Remove type if unchecked
        return {
          ...prevData,
          employeeTypes: currentTypes.filter(t => t.id !== employeeType.id)
        };
      }
      return { ...prevData, employeeTypes: currentTypes };
    });
  };

  const buildColumn = (types: EmployeeTypeDto[], selectedTypes: EmployeeTypeDto[]) => (
    types.map(t => {
      const isSelected = selectedTypes.some(st => st.id === t.id);
      return (
        <div key={t.id} className="columnItem">
          <label className="checkboxLabel">
            <input
              type="checkbox"
              id={`type-${t.id}`}
              checked={isSelected}
              onChange={(e) => onEmployeeTypeChange(t, e.target.checked)}
            />
            <span>{t.typeName}</span>
          </label>
        </div>
      );
    })
  );

  return (
    <div>
      <UnAuthRedirect />
      <ScreenHeader screenName={employeeGroupTypes.groupName}>
        <button className="btn btnPrimary" onClick={onNewEmployee}>+ New {employeeGroupTypes.groupName}</button>
      </ScreenHeader>
      <div className="tableContainer">
        <div className="tableScroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 && employees.map(employee => createEmployeeRow(employee))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal config={{
        title: `Delete ${employeeGroupTypes.groupName}`,
        yesFunction: () => { console.log("Yes " + new Date()) },
        modalType: ModalType.WARNING,
        yesLabel: "Delete",
        noLabel: "Cancel"
      }} show={showEmployeeDeleteModal} setShow={setShowEmployeeDeleteModal}>
        Delete {modalEmployeeDelete.firstName} {modalEmployeeDelete.lastName}
      </Modal>

      <Modal config={{
        title: modalEmployee.id ? `Edit ${employeeGroupTypes.groupName}` : `New ${employeeGroupTypes.groupName}`,
        yesFunction: () => onModalEmployeeSave(modalEmployee),
        modalType: ModalType.DEFAULT,
        yesLabel: "Save",
        noLabel: "Cancel"
      }} show={showModalEmployeeModal} setShow={setShowModalEmployeeModal}>
        <form>
          <ErrorForm formState={modalEmployeeFormState} errors={modalEmployeeErrors} />
          <Loading formState={modalEmployeeFormState} />

          {/* 
          <input id="id" type="number" onChange={onChangeText}
            value={modalEmployee.id} />
          <input id="companyId" type="number" onChange={onChangeText}
            value={modalEmployee.companyId} /> 
          */}

          <div className="formGroup">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" onChange={onChangeText}
              value={modalEmployee.email} />
            <ErrorField errors={modalEmployeeErrors} fieldName="email" />
          </div>

          {/* Password */}
          {!modalEmployee.id && <>
            <div className="formGroup">
              <label htmlFor="usersPassword">Password</label>
              <input id="usersPassword" type="password" onChange={onChangeText}
                value={modalEmployee.usersPassword} />
              <ErrorField errors={modalEmployeeErrors} fieldName="usersPassword" />
            </div>
            <div className="formGroup">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" type="password" onChange={(event) => setConfirmPassword(event.target.value)}
                value={confirmPassword} />
              <ErrorField errors={modalEmployeeErrors} fieldName="confirmPassword" />
            </div>
          </>}

          <div className="formGroup">
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" type="text" onChange={onChangeText}
              value={modalEmployee.firstName} />
            <ErrorField errors={modalEmployeeErrors} fieldName="firstName" />
          </div>
          <div className="formGroup">
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" type="text" onChange={onChangeText}
              value={modalEmployee.lastName} />
            <ErrorField errors={modalEmployeeErrors} fieldName="lastName" />
          </div>
          <div className="formGroup">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input id="phoneNumber" type="text" onChange={onChangeText}
              value={modalEmployee.phoneNumber} />
            <ErrorField errors={modalEmployeeErrors} fieldName="phoneNumber" />
          </div>
          {buildColumns(employeeGroupTypes, modalEmployee.employeeTypes)}
        </form>
      </Modal>
    </div>
  );
}
