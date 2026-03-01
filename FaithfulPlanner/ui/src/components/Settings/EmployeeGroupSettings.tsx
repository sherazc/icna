import { useContext, useEffect, useState } from "react";
import { defaultEmployeeGroupTypeDto, ModalType, type EmployeeGroupTypesDto, type EmployeeTypeDto, type ModalConfig } from "../../service/service-types";
import { AppContext } from "../../store/context";
import "./EmployeeGroupSettings.css";
import { Modal } from "../common/Modal";
import { touchNumber } from "../../service/utilities";

interface Props { }

let tempId = -1;
export const EmployeeGroupSettings: React.FC<Props> = () => {

  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [groups, setGroups] = useState<EmployeeGroupTypesDto[]>([]);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});
  const [modalMessage, setModalMessage] = useState<string>("");

  const loadData = async () => {
    const groupsResponse = await clinicApis.getEmployeeGroupsTypes(authUserToken.companyId)
    setGroups(groupsResponse);
  };

  useEffect(() => {
    loadData();
  }, [authUserToken]);

  const onAddGroup = () => {
    const groupNew = defaultEmployeeGroupTypeDto();
    groupNew.id = tempId--;
    const allGroups = [...groups];
    allGroups.push(groupNew);
    setGroups(allGroups);
  };

  const onAddType = (groupId: number) => {
    const groupsNew = [...groups];
    const index = groupsNew.findIndex((g) => g.id === groupId);
    groupsNew[index].employeeTypes.push({id: tempId--, typeName: ""});
    setGroups(groupsNew);
  };

  const onDeleteGroup = async (companyId: number, groupId: number) => {
    if (groupId < 0) {
      deleteGroup(groupId);
    } else {
      const hasEmployees: boolean = await clinicApis.hasUsersInGroup(companyId, groupId);

      if (hasEmployees) {
        setModalConfig({
          title: "Delete group",
          modalType: ModalType.ERROR,
          yesLabel: "Ok",
          yesFunction: () => setModalShow(false)
        });
        setModalMessage("Can not delete group. There are employees in this group.");
        setModalShow(true);
      } else {
        deleteGroup(groupId);
      }
    }
  };

  const deleteGroup = (groupId: number) => {
    const filteredGroups = groups.filter(a => a.id !== groupId);
    setGroups(filteredGroups);
  };


  const onDeleteType = async (groupId: number, typeId: number) => {
    if (typeId < 0) {
      deleteType(groupId, typeId);
    } else {
      setModalConfig({
        title: "Delete type",
        modalType: ModalType.WARNING,
        yesLabel: "Ok",
        yesFunction: () => {
          deleteType(groupId, typeId);
          setModalShow(false);
        },
        noLabel: "Cancel"
      });
      setModalMessage("Employee type label will be removed from the employees that it is attached to.");
      setModalShow(true);
    }
  };

  const deleteType = (groupId: number, typeId: number) => {
    const groupsNew = [...groups];
    const index = groupsNew.findIndex((g) => g.id === groupId);
    groupsNew[index].employeeTypes = groupsNew[index].employeeTypes.filter(t => t.id !== typeId);
    setGroups(groupsNew);
  };

  const createGroupCard = (group: EmployeeGroupTypesDto) => (
    <div key={group.id} className="group-card">
      <div className="group-header">
        <div className="group-title">
          <input
            type="text"
            defaultValue={group.groupName}
            className="group-name-input"
            placeholder="Group name"
            style={group.groupName ? {} : {backgroundColor: "pink"}}
          />
        </div>
        <div className="group-actions">
          <button className="btn btn-icon btn-edit" title="Edit group">✎</button>
          <button className="btn btn-icon btn-delete" title="Delete group"
            onClick={() => onDeleteGroup(authUserToken.companyId, touchNumber(group.id))}>🗑</button>
        </div>
      </div>
      <div className="employee-types-section">
        <div className="section-label">Employee Types</div>
        {group.employeeTypes && group.employeeTypes.length > 0 ? (
          <div className="employee-types-list">
            {group.employeeTypes.map(employeeType => createEmployeeTypeField(touchNumber(group.id), employeeType))}
          </div>
        ) : (
          <div className="empty-state">No employee types added</div>
        )}
        <button className="btn btn-secondary btn-sm btn-add-type"
          onClick={() => onAddType(touchNumber(group.id))}>+ Add Type</button>
      </div>
    </div>
  );

  const createEmployeeTypeField = (groupId: number, employeeType: EmployeeTypeDto) => (
    <div key={employeeType.id} className="employee-type-item">
      <input
        type="text"
        defaultValue={employeeType.typeName}
        className="employee-type-input"
        placeholder="Employee type name"
      />
      <button className="btn btn-icon btn-remove" title="Remove type"
        onClick={() => onDeleteType(groupId, touchNumber(employeeType.id))}>×</button>
    </div>
  );

  return (
    <>
      <div className="card employee-group-settings">
        <div className="settings-header">
          <h2>Employee Groups</h2>
          <button className="btn btnPrimary btn-sm" onClick={onAddGroup}>+ Add Group</button>
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

      <Modal setShow={setModalShow} show={modalShow} config={modalConfig}>
        {modalMessage}
      </Modal>
    </>
  );
}