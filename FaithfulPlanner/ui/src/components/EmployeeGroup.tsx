import type React from "react";
import { useParams } from "react-router-dom";
import { ScreenHeader } from "./common/ScreenHeader";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../store/context";
import { defaultEmployeeGroupDto, type EmployeeGroupDto, type EmployeeTypeDto, type UserProfileEmployeeTypesDto } from "../service/service-types";
import { UnAuthRedirect } from "./auth/UnAuthRedirect";

interface Props { }

export const EmployeeGroup: React.FC<Props> = () => {
  const { employeeGroupId } = useParams();
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [employeeGroup, setEmployeeGroup] = useState<EmployeeGroupDto>(defaultEmployeeGroupDto());
  const [employees, setEmployees] = useState<UserProfileEmployeeTypesDto[]>([]);


  const loadEmployeeGroup = async (companyId: number, groupId: number) => {
    const employeeGroupResponse = await clinicApis.getEmployeeGroup(companyId, groupId);
    setEmployeeGroup(employeeGroupResponse);
    const employeesResponse = await clinicApis.getUserProfileEmployeeTypes(companyId, groupId);
    setEmployees(employeesResponse);
  };

  useEffect(() => {
    if (employeeGroupId && authUserToken.companyId) {
      loadEmployeeGroup(authUserToken.companyId, +employeeGroupId);
    }
  }, [employeeGroupId, authUserToken]);


  const createEmployeeTypes = (employeeTypes: EmployeeTypeDto[]): React.ReactNode => {
    return <>Employee types</>;
  }


  const createEmployeeRow = (employee: UserProfileEmployeeTypesDto): React.JSX.Element => (
    <tr key={employee.id}>
      <td>{employee.firstName} {employee.lastName}</td>
      <td>{employee.employeeTypes.length > 0 && <small className="smallText">({createEmployeeTypes(employee.employeeTypes)})</small>}</td>
      <td></td>
      <td>8 <small className="smallText">(Rodriguez, Thompson, Kim, Anderson +4 more)</small></td>
      <td><span className="badge badgeSuccess">Scheduled</span></td>
      <td>
        <button className="actionBtn actionBtnEdit" data-onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
        <button className="actionBtn actionBtnDelete" data-onclick="event.stopPropagation()">Delete</button>
      </td>
    </tr>
  )

  return (
    <div>
      <UnAuthRedirect />
      <ScreenHeader screenName={employeeGroup.groupName}>
        <button className="btn btnPrimary" data-onclick="openModal('addClinicModal')">+ New {employeeGroup.groupName}</button>
      </ScreenHeader>
      <div className="tableContainer">
        <div className="tableScroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Providers Assigned</th>
                <th>Volunteers Assigned</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 && employees.map(employee => createEmployeeRow(employee))}



            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

