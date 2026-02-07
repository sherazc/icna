import type React from "react";
import { useParams } from "react-router-dom";
import { ScreenHeader } from "./common/ScreenHeader";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../store/context";
import { defaultEmployeeGroupDto, type EmployeeGroupDto, type UserProfileEmployeeTypesDto } from "../service/service-types";
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

  return (
    <div>
      <UnAuthRedirect/>
      <ScreenHeader screenName={employeeGroup.groupName}>
        <button className="btn btnPrimary" data-onclick="openModal('addClinicModal')">+ New {employeeGroup.groupName}</button>
      </ScreenHeader>
      Employee Group {employeeGroupId}
    </div>
  );
}