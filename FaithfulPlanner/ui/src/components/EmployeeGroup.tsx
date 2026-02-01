import type React from "react";
import { useParams } from "react-router-dom";
import { ScreenHeader } from "./common/ScreenHeader";

interface Props { }

export const EmployeeGroup: React.FC<Props> = () => {
  const { employeeGroupId } = useParams();
  

  return (
    <div>
      <ScreenHeader screenName="Employee">
        <button className="btn btnSecondary" data-onclick="switchScreen('org-selection')">Switch Organization</button>
        <button className="btn btnPrimary" data-onclick="openModal('addClinicModal')">+ New Clinic Date</button>
      </ScreenHeader>

      Employee Group {employeeGroupId}

    </div>
  );
}