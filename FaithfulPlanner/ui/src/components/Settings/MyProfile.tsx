import { useContext, useEffect, useState } from "react";
import { defaultEmployeeGroupTypeDto, defaultUserProfileDto, type EmployeeGroupTypesDto, type UserProfileDto } from "../../service/service-types";
import { AppContext } from "../../store/context";
import { UserProfileForm } from "../common/UserProfileForm";

interface Props {
  initialUserProfile: UserProfileDto;
  onSaveSuccess?: (savedEmployee: UserProfileDto) => void;
}

export const MyProfile: React.FC<Props> = ({ initialUserProfile, onSaveSuccess }) => {
  const [{ clinicApis }] = useContext(AppContext);
  const [userProfile, setUserProfile] = useState<UserProfileDto>(defaultUserProfileDto());
  const [employeeGroupTypes, setEmployeeGroupTypes] = useState<EmployeeGroupTypesDto>(defaultEmployeeGroupTypeDto());

  const loadEmployeeGroups = async (companyId: number, groupId: number) => {
    const employeeGroupTypesResponse = await clinicApis.getEmployeeGroupTypes(companyId, groupId);
    setEmployeeGroupTypes(employeeGroupTypesResponse);
  };

  useEffect(() => {
    if (initialUserProfile) {
      setUserProfile(initialUserProfile);
    }
  }, [initialUserProfile]);



  useEffect(() => {
    if (userProfile && userProfile.companyId && userProfile.employeeGroupId) {
      loadEmployeeGroups(userProfile.companyId, userProfile.employeeGroupId);
    }
  }, [userProfile]);


  return (
    <div className="card">
      <h3>My Profile</h3>
      <UserProfileForm
        initialUserProfile={userProfile}
        showPasswordFields={false}
        onSaveSuccess={(savedUser) => {
          setUserProfile(savedUser);
          onSaveSuccess?.(savedUser);
        }}
        employeeGroupTypes={employeeGroupTypes}
      />
    </div>
  )
}