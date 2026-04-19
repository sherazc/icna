import { useContext, useEffect, useState } from "react";
import { defaultUserProfileDto, type UserProfileDto } from "../../service/service-types";
import { AppContext } from "../../store/context";
import { UserProfileForm } from "../common/UserProfileForm";

export const MyProfile = () => {
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [userProfile, setUserProfile] = useState<UserProfileDto>(defaultUserProfileDto());

  useEffect(() => {
    const loadData = async () => {
      const userProfileResponse = await clinicApis.getUserProfile(authUserToken.companyId, authUserToken.userProfileId)
      setUserProfile(userProfileResponse);
    };

    if (authUserToken.companyId && authUserToken.userProfileId) {
      loadData();
    }
  }, [authUserToken]);

  return (
    <div className="card">
      <h3>My Profile</h3>
      <UserProfileForm
        initialUserProfile={userProfile}
        showPasswordFields={false}
        onSaveSuccess={(savedEmployee) => setUserProfile(savedEmployee)}
      />
    </div>
  )
}