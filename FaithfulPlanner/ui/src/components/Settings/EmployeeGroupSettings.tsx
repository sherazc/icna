import { useContext, useEffect, useState } from "react";
import type { EmployeeGroupTypesDto } from "../../service/service-types";
import { AppContext } from "../../store/context";
import "EmployeeGroupSettings.css";

interface Props { }
export const EmployeeGroupSettings: React.FC<Props> = () => {

  const [{ authUserToken, clinicApis }] = useContext(AppContext);

  const [groups, setGroups] = useState<EmployeeGroupTypesDto[]>([]);

  const loadData = async () => {
    const groupsResponse = await clinicApis.getEmployeeGroupsTypes(authUserToken.companyId)
    setGroups(groupsResponse);
  };

  useEffect(() => {
    loadData();
  }, [authUserToken]);



  return (
    <div className="card">
      <h3>Employee Group</h3>
      {groups && groups.length > 0 && groups.map(group => (
        <div key={group.id}>
          <h4>{group.groupName}</h4>
          {group.employeeTypes && group.employeeTypes.length > 0 && group.employeeTypes.map(employeeType => (
            <div key={employeeType.id}>
              <div>{employeeType.typeName}</div>
            </div>
          ))}
        </div>
      ))}

      <button className="btn btnPrimary fullWidth marginTop15">Save</button>
    </div>
  );
}