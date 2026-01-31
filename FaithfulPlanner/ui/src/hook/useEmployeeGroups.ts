import { useContext, useEffect, useState } from "react";
import type { EmployeeGroupDto } from "../service/service-types";
import { AppContext } from "../store/context";
import { isAuthenticated } from "../service/authentication-services";

export const useEmployeeGroups = () => {
  const [employeeGroups, setEmployeeGroups] = useState<EmployeeGroupDto[]>([]);
  const [{ clinicApis, authUserToken }] = useContext(AppContext);

  useEffect(() => {
    const loadEmployeeGroups = async () => {
      if (isAuthenticated(true, authUserToken) && authUserToken.companyId) {
        const employeeGroupsResponse = await clinicApis.getEmployeeGroups(authUserToken.companyId);
        setEmployeeGroups(employeeGroupsResponse);
      }
    };
    loadEmployeeGroups();
  }, [authUserToken]);

  return employeeGroups;
}