import { useContext, useEffect } from "react";
import { AppContext } from "../store/context";
import { isAuthenticated } from "../service/authentication-services";
import { ActionNameEmployeeGroup } from "../store/employeeGroupsReducer";

export const useEmployeeGroups = () => {
  const [{ clinicApis, authUserToken, employeeGroups }, dispatch] = useContext(AppContext);

  useEffect(() => {
    const loadEmployeeGroups = async () => {
      if (isAuthenticated(true, authUserToken) && authUserToken.companyId) {
        const employeeGroupsResponse = await clinicApis.getEmployeeGroups(authUserToken.companyId);
        dispatch({
          type: ActionNameEmployeeGroup.setEmployeeGroups,
          payload: employeeGroupsResponse
        })

      }
    };
    loadEmployeeGroups();
  }, [authUserToken]);

  return employeeGroups;
}