import type React from "react";
import { useParams } from "react-router-dom";
import { ScreenHeader } from "./common/ScreenHeader";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../store/context";
import { defaultEmployeeGroupDto, type EmployeeGroupDto } from "../service/service-types";

interface Props { }

export const EmployeeGroup: React.FC<Props> = () => {
  const { employeeGroupId } = useParams();
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [employeeGroup, setEmployeeGroup] = useState<EmployeeGroupDto>(defaultEmployeeGroupDto());


  const loadEmployeeGroup = async (companyId: number, groupId: number) => {
    const employeeGroupResponse = await clinicApis.getEmployeeGroup(companyId, groupId);
    setEmployeeGroup(employeeGroupResponse);
  };

  useEffect(() => {
    if (employeeGroupId && authUserToken.companyId) {
      loadEmployeeGroup(authUserToken.companyId, +employeeGroupId)
    }
  }, [employeeGroupId, authUserToken]);

  return (
    <div>
      <ScreenHeader screenName={employeeGroup.groupName}>
        <button className="btn btnSecondary" data-onclick="switchScreen('org-selection')">Switch Organization</button>
        <button className="btn btnPrimary" data-onclick="openModal('addClinicModal')">+ New Clinic Date</button>
      </ScreenHeader>
      Employee Group {employeeGroupId}
    </div>
  );
}