import { useContext, useEffect, useState } from "react";
import { defaultEmployeeGroupTypeDto, defaultUserProfileDto, type EmployeeGroupTypesDto, type UserProfileDto } from "../../service/service-types";
import { AppContext } from "../../store/context";
import { UserProfileForm } from "../common/UserProfileForm";

export const MyProfile = () => {
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [userProfile, setUserProfile] = useState<UserProfileDto>(defaultUserProfileDto());
  const [employeeGroupTypes, setEmployeeGroupTypes] = useState<EmployeeGroupTypesDto>(defaultEmployeeGroupTypeDto());

  const loadEmployeeGroups = async (companyId: number, groupId: number) => {
    const employeeGroupTypesResponse = await clinicApis.getEmployeeGroupTypes(companyId, groupId);
    setEmployeeGroupTypes(employeeGroupTypesResponse);
  };

  useEffect(() => {
    const loadData = async () => {
      const userProfileResponse = await clinicApis.getUserProfile(authUserToken.companyId, authUserToken.userProfileId)
      setUserProfile(userProfileResponse);
    };

    if (authUserToken.companyId && authUserToken.userProfileId) {
      loadData();
    }
  }, [authUserToken]);


  useEffect(() => {
    if(userProfile && userProfile.companyId && userProfile.employeeGroupId) {
      loadEmployeeGroups(userProfile.companyId, userProfile.employeeGroupId);
    }
  }, [userProfile]);


  return (
    <div className="card">
      <h3>My Profile</h3>
      <UserProfileForm
        initialUserProfile={userProfile}
        showPasswordFields={false}
        onSaveSuccess={(savedEmployee) => setUserProfile(savedEmployee)}
        employeeGroupTypes={employeeGroupTypes}
      />
    </div>
  )
}