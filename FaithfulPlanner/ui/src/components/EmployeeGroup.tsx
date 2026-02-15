import type React from "react";
import { useParams } from "react-router-dom";
import { ScreenHeader } from "./common/ScreenHeader";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../store/context";
import { defaultEmployeeGroupDto, defaultEmployeeGroupTypeDto, defaultUserProfileEmployeeTypesDto, ModalType, type EmployeeGroupDto, type EmployeeGroupTypesDto, type EmployeeTypeDto, type UserProfileEmployeeTypesDto } from "../service/service-types";
import { UnAuthRedirect } from "./auth/UnAuthRedirect";
import { Modal } from "./common/Modal";

interface Props { }

export const EmployeeGroup: React.FC<Props> = () => {
  const { employeeGroupId } = useParams();
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [employeeGroup, setEmployeeGroup] = useState<EmployeeGroupDto>(defaultEmployeeGroupDto());
  const [employees, setEmployees] = useState<UserProfileEmployeeTypesDto[]>([]);
  const [modalEmployee, setModalEmployee] = useState<UserProfileEmployeeTypesDto>(defaultUserProfileEmployeeTypesDto());
  const [modalEmployeeDelete, setModalEmployeeDelete] = useState<UserProfileEmployeeTypesDto>(defaultUserProfileEmployeeTypesDto());
  const [showEmployeeModal, setShowEmployeeModal] = useState<boolean>(false);
  const [showEmployeeDeleteModal, setShowEmployeeDeleteModal] = useState<boolean>(false);
  const [employeeGroupTypes, setEmployeeGroupTypes] = useState<EmployeeGroupTypesDto>(defaultEmployeeGroupTypeDto());

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setModalEmployee(prevData => ({ ...prevData, [id]: value }));
  };

  const loadData = async (companyId: number, groupId: number) => {
    const employeeGroupResponse = await clinicApis.getEmployeeGroup(companyId, groupId);
    setEmployeeGroup(employeeGroupResponse);
    const employeesResponse = await clinicApis.getUserProfileEmployeeTypes(companyId, groupId);
    setEmployees(employeesResponse);
    const employeeGroupTypesResponse = await clinicApis.getEmployeeGroupTypes(companyId, groupId);
    setEmployeeGroupTypes(employeeGroupTypesResponse);
  };

  const onNewEmployee = () => {
    console.log(`New employee`);
    setModalEmployee({...defaultUserProfileEmployeeTypesDto(), companyId: authUserToken.companyId});
    setShowEmployeeModal(true);
  }

  const onEditEmployee = (employee: UserProfileEmployeeTypesDto) => {
    console.log(`Edit employee ${employee.id}`, employee);
    setModalEmployee(employee);
    setShowEmployeeModal(true);
  }

  const onDeleteEmployee = (employee: UserProfileEmployeeTypesDto) => {
    console.log(`Delete employee ${employee.id}`);
    setModalEmployeeDelete(employee);
    setShowEmployeeDeleteModal(true);
  }

  useEffect(() => {
    if (employeeGroupId && authUserToken.companyId) {
      loadData(authUserToken.companyId, +employeeGroupId);
    }
  }, [employeeGroupId, authUserToken]);

  const createEmployeeTypes = (employeeTypes: EmployeeTypeDto[]): React.ReactNode => (
    <small className="smallText">{employeeTypes.map(et => et.typeName).join(", ")}</small>
  )

  const createEmployeeRow = (employee: UserProfileEmployeeTypesDto): React.JSX.Element => (
    <tr key={employee.id}>
      <td>{employee.firstName} {employee.lastName}</td>
      <td>{employee.employeeTypes.length > 0 && createEmployeeTypes(employee.employeeTypes)}</td>
      <td>{employee.email}</td>
      <td>{employee.phoneNumber}</td>
      <td>
        <span className="badge badgeSuccess">Scheduled</span>
        <button className="actionBtn actionBtnEdit" onClick={() => onEditEmployee(employee)}>Edit</button>
        <button className="actionBtn actionBtnDelete" onClick={() => onDeleteEmployee(employee)}>Delete</button>
      </td>
    </tr>
  )

  
  return (
    <div>
      <UnAuthRedirect />
      <ScreenHeader screenName={employeeGroup.groupName}>
        <button className="btn btnPrimary" onClick={onNewEmployee}>+ New {employeeGroup.groupName}</button>
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
        title: `Delete ${employeeGroup.groupName}`,
        yesFunction: () => { console.log("Yes " + new Date()) },
        modalType: ModalType.WARNING,
        yesLabel: "Delete",
        noLabel: "Cancel"
      }} show={showEmployeeDeleteModal} setShow={setShowEmployeeDeleteModal}>
        Delete {modalEmployeeDelete.firstName} {modalEmployeeDelete.lastName}
      </Modal>

      <Modal config={{
        title: modalEmployee.id ? `Edit ${employeeGroup.groupName}` : `New ${employeeGroup.groupName}`,
        yesFunction: () => { console.log("Yes " + new Date()) },
        modalType: ModalType.DEFAULT,
        yesLabel: "Save",
        noLabel: "Cancel"
      }} show={showEmployeeModal} setShow={setShowEmployeeModal}>
        <form>
          <input id="id" type="number" onChange={onChangeText}
            value={modalEmployee.id}/>
          <input id="companyId" type="number" onChange={onChangeText}
            value={modalEmployee.companyId}/>
          <div id="firstName" className="formGroup">
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" type="text" onChange={onChangeText}
              value={modalEmployee.firstName}/>
          </div>
          <div id="lastName" className="formGroup">
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" type="text" onChange={onChangeText}
              value={modalEmployee.lastName}/>
          </div>
          <div id="email" className="formGroup">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" onChange={onChangeText}
              value={modalEmployee.email}/>
          </div>
          <div id="phoneNumber" className="formGroup">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input id="phoneNumber" type="text" onChange={onChangeText}
              value={modalEmployee.phoneNumber}/>
          </div>
        </form>
      </Modal>
    </div>
  );
}


/*
export type UserProfileDto = {
  id?: number,
  email: string,
  usersPassword?: string,
  companyId?: number
  firstName?: string,
  lastName?: string,
  phoneNumber?: string
};
*/
