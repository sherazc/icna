import { useContext, useEffect, useState } from "react";
import type { EmployeeGroupTypesDto, EmployeeTypeDto } from "../../service/service-types";
import { AppContext } from "../../store/context";
import "./EmployeeGroupSettings.css";

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

  const createGroupCard = (group: EmployeeGroupTypesDto) => (
    <div key={group.id} className="group-card">
      <div className="group-header">
        <div className="group-title">
          <input
            type="text"
            defaultValue={group.groupName}
            className="group-name-input"
            placeholder="Group name"
          />
        </div>
        <div className="group-actions">
          <button className="btn btn-icon btn-edit" title="Edit group">✎</button>
          <button className="btn btn-icon btn-delete" title="Delete group">🗑</button>
        </div>
      </div>
      <div className="employee-types-section">
        <div className="section-label">Employee Types</div>
        {group.employeeTypes && group.employeeTypes.length > 0 ? (
          <div className="employee-types-list">
            {group.employeeTypes.map(employeeType => createEmployeeTypeField(employeeType))}
          </div>
        ) : (
          <div className="empty-state">No employee types added</div>
        )}
        <button className="btn btn-secondary btn-sm btn-add-type">+ Add Type</button>
      </div>
    </div>
  );

  const createEmployeeTypeField = (employeeType: EmployeeTypeDto) => (
    <div key={employeeType.id} className="employee-type-item">
      <input
        type="text"
        defaultValue={employeeType.typeName}
        className="employee-type-input"
        placeholder="Employee type name"
      />
      <button className="btn btn-icon btn-remove" title="Remove type">×</button>
    </div>
  );

  return (
    <div className="card employee-group-settings">
      <div className="settings-header">
        <h2>Employee Groups</h2>
        <button className="btn btnPrimary btn-sm">+ Add Group</button>
      </div>
      <div className="groups-container">
        {groups && groups.length > 0 ? (
          groups.map(group => createGroupCard(group))
        ) : (
          <div className="empty-state-container">
            <p>No employee groups created yet</p>
            <button className="btn btnPrimary">Create First Group</button>
          </div>
        )}
      </div>
      <div className="settings-footer">
        <button className="btn btnPrimary btn-lg">Save All Changes</button>
      </div>
    </div>
  );
}