import { useContext, useEffect, useState } from "react";
import { defaultEmployeeGroupTypeDto, FormState, ModalType, type EmployeeGroupTypesDto, type EmployeeTypeDto, type ErrorDto, type ModalConfig } from "../../service/service-types";
import { AppContext } from "../../store/context";
import "./TeamSettings.css";
import { Modal } from "../common/Modal";
import { touchNumber } from "../../service/utilities";
import { toScErrorResponses, validateEmployeeGroupsForm } from "../../service/errors-helpers";
import { ErrorForm } from "../common/ErrorForm";
import { Loading } from "../common/Loading";
import { ActionNameEmployeeGroup } from "../../store/employeeGroupsReducer";

interface Props { }

let tempId = -1;
export const TeamSettings: React.FC<Props> = () => {


  const createGroupCard = (group: EmployeeGroupTypesDto) => (
    <div key={group.id} className="group-card">
      <div className="group-header">
        <div className="group-title">
          <input
            type="text"
            defaultValue={group.groupName}
            className={group.groupName ? "group-name-input" : "group-name-input input-empty"}
            placeholder="Group name"
            // onChange={(e) => onChangeGroupName(e, touchNumber(group.id))}
          />
        </div>
        <div className="group-actions">
          <button className="btn btn-icon btn-edit" title="Edit group">✎</button>
          <button className="btn btn-icon btn-delete" title="Delete group"
            // onClick={() => onDeleteGroup(authUserToken.companyId, touchNumber(group.id))}
            >🗑</button>
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
          // onClick={() => onAddType(touchNumber(group.id))}
          >+ Add Type</button>
      </div>
    </div>
  );

  const createEmployeeTypeField = (groupId: number, employeeType: EmployeeTypeDto) => (
    <div key={employeeType.id}
      className={employeeType.typeName ? "employee-type-item" : "employee-type-item input-empty"}>
      <input
        type="text"
        defaultValue={employeeType.typeName}
        className="employee-type-input"
        placeholder="Employee type name"
        // onChange={e => onChangeTypeName(e, groupId, touchNumber(employeeType.id))}
         />
      <button className="btn btn-icon btn-remove" title="Remove type"
        // onClick={() => onDeleteType(groupId, touchNumber(employeeType.id))}
        >×</button>
    </div>
  );

  return (
    <>
      <div className="card employee-group-settings">
        <div className="settings-header">
          <h2>Teams</h2>
          <button className="btn btnPrimary btn-sm" 
          // onClick={onAddGroup}
          >+ Add Group</button>
        </div>
        <ErrorForm 
        // formState={formState} errors={errors} 
        />
        {/* <Loading formState={formState} /> */}

        <div className="groups-container">
{/*         
          {groups && groups.length > 0 ? (
            groups.map(group => createGroupCard(group))
          ) : (
            <div className="empty-state-container">
              <p>No employee groups created yet</p>
              <button className="btn btnPrimary" onClick={onAddGroup}>Create First Group</button>
            </div>
          )}
           */}
        </div>
        {/* <Loading formState={formState}/> */}
        <div className="settings-footer">
          <button className="btn btnPrimary btn-lg" 
          //onClick={() => onSave()}
            >Save All Teams</button>
        </div>
      </div>
{/* 
      <Modal setShow={setModalShow} show={modalShow} config={modalConfig}>
        {modalMessage}
      </Modal> */}
    </>
  );
}