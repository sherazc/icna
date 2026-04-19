import type React from "react";

import { useParams } from "react-router-dom";
import { ScreenHeader } from "./common/ScreenHeader";
import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../store/context";
import {
  defaultEmployeeGroupTypeDto,
  defaultUserProfileDto,
  FormState,
  ModalType,
  type EmployeeGroupTypesDto,
  type EmployeeTypeDto,
  type ErrorDto,
  type UserProfileDto
} from "../service/service-types"; import { UnAuthRedirect } from "./auth/UnAuthRedirect";
import { Modal } from "./common/Modal";
import { touchNumber } from "../service/utilities";
import { toScErrorResponses } from "../service/errors-helpers";
import { ErrorForm } from "./common/ErrorForm";
import { Loading } from "./common/Loading";
import { UserProfileForm } from "./common/UserProfileForm";

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
  const formRef = useRef<HTMLFormElement>(null);

  const [modalEmployeeDeleteState, setModalEmployeeDeleteFormState] = useState<FormState>(FormState.FRESH);
  const [modalEmployeeDeleteErrors, setModalEmployeeDeleteErrors] = useState<ErrorDto[]>([]);

  const loadData = async (companyId: number, groupId: number) => {
    const employeesResponse = await clinicApis.getUserProfileEmployeeTypes(companyId, groupId);
    setEmployees(employeesResponse);
    const employeeGroupTypesResponse = await clinicApis.getEmployeeGroupTypes(companyId, groupId);
    setEmployeeGroupTypes(employeeGroupTypesResponse);
  };

  const onNewEmployee = () => {
    console.log(`New employee`);
    setModalEmployee({ ...defaultUserProfileDto(), companyId: authUserToken.companyId });
    setShowModalEmployeeModal(true);
  };

  const onEditModalEmployee = (employee: UserProfileDto) => {
    console.log(`Edit employee ${employee.id}`, employee);
    setModalEmployee(employee);
    setShowModalEmployeeModal(true);
  };

  const onDeleteEmployee = (employee: UserProfileDto) => {
    console.log(`Delete employee ${employee.id}`);
    setModalEmployeeDelete(employee);
    setShowEmployeeDeleteModal(true);
  };

  const handleSaveSuccess = async (savedEmployee: UserProfileDto) => {
    console.log(savedEmployee);
    setShowModalEmployeeModal(false);
    setModalEmployee(defaultUserProfileDto());
    const employeesResponse = await clinicApis.getUserProfileEmployeeTypes(
      authUserToken.companyId,
      touchNumber(employeeGroupId)
    );
    setEmployees(employeesResponse);
  };

  const deleteEmployee = async (companyId: number, groupId: number, userProfileId: number) => {
    const submitErrors: ErrorDto[] = [];
    setModalEmployeeDeleteErrors([]);
    try {
      setModalEmployeeDeleteFormState(FormState.IN_PROGRESS);
      await clinicApis.deleteUserProfile(companyId, userProfileId);
      const employeesResponse = await clinicApis.getUserProfileEmployeeTypes(companyId, groupId);
      setEmployees(employeesResponse);
      setModalEmployeeDeleteFormState(FormState.SUCCESSFUL);
      setShowEmployeeDeleteModal(false);
    } catch (error) {
      const apiErrors: ErrorDto[] = toScErrorResponses(error);
      submitErrors.push(...apiErrors);
      submitErrors.push({ message: "Failed to delete" });
    }
    setModalEmployeeDeleteErrors(submitErrors);
  }

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
        <button className="actionBtn actionBtnEdit" onClick={() => onEditModalEmployee(employee)}>Edit</button>
        <button className="actionBtn actionBtnDelete" onClick={() => onDeleteEmployee(employee)}>Delete</button>
      </td>
    </tr>
  );

  return (
    <div>
      <UnAuthRedirect />
      <ScreenHeader screenName={employeeGroupTypes.groupName}>
        <button className="btn btnPrimary" onClick={onNewEmployee}>+ New {employeeGroupTypes.groupName}</button>
      </ScreenHeader>
      <div className="tableContainer">

        {employees.length < 1 && (
          <div className="padding-20">
            No {employeeGroupTypes.groupName} found. Click <a href="#" onClick={onNewEmployee}>New {employeeGroupTypes.groupName}</a>.
          </div>
        )}
        {employees.length > 0 && (
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
              {employees.map(employee => createEmployeeRow(employee))}
            </tbody>
          </table>
        </div>
      )}

      </div>
      <Modal config={{
        title: `Delete ${employeeGroupTypes.groupName}`,
        yesFunction: () => deleteEmployee(authUserToken.companyId, touchNumber(employeeGroupId), touchNumber(modalEmployeeDelete.id)),
        modalType: ModalType.WARNING,
        yesLabel: "Delete",
        noLabel: "Cancel"
      }} show={showEmployeeDeleteModal} setShow={setShowEmployeeDeleteModal}>
        <>
          <ErrorForm formState={modalEmployeeDeleteState} errors={modalEmployeeDeleteErrors} />
          <Loading formState={modalEmployeeDeleteState} />
          <div>Delete {modalEmployeeDelete.firstName} {modalEmployeeDelete.lastName}. </div>
          <div><strong>Warning:</strong> This will also delete all of this user's schedules.</div>
        </>
      </Modal>

      <Modal config={{
        title: modalEmployee.id ? `Edit ${employeeGroupTypes.groupName}` : `New ${employeeGroupTypes.groupName}`,
        yesFunction: () => formRef.current?.requestSubmit(),
        modalType: ModalType.DEFAULT,
        yesLabel: "Save",
        noLabel: "Cancel"
      }} show={showModalEmployeeModal} setShow={setShowModalEmployeeModal}>
        <UserProfileForm
          ref={formRef}
          initialUserProfile={modalEmployee}
          employeeGroupTypes={employeeGroupTypes}
          showPasswordFields={!modalEmployee.id}
          onSaveSuccess={handleSaveSuccess}
        />
      </Modal>
    </div>
  );
}
