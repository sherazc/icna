import { useContext, useEffect, useState } from "react";
import { Authenticated } from "../auth/Authenticated";
import { UnAuthRedirect } from "../auth/UnAuthRedirect";
import { ScreenHeader } from "../common/ScreenHeader";
import { SwitchGroup } from "../common/SwitchGroup";
import { CompanyDetails } from "./CompanyDetails";
import { EmployeeGroupSettings } from "./EmployeeGroupSettings";
import { MyPassword } from "./MyPassword";
import { MyProfile } from "./MyProfile";
import { Theme } from "./Theme";
import { AppContext } from "../../store/context";
import { defaultUserProfileDto, type UserProfileDto } from "../../service/service-types";

export default function Settings() {
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [userProfile, setUserProfile] = useState<UserProfileDto>(defaultUserProfileDto());
  
  const onSuccessfulSaveUser = (savedEmployee: UserProfileDto) => {
    setUserProfile(savedEmployee)
  }

  useEffect(() => {
    const loadData = async () => {
      if (authUserToken && authUserToken.companyId && authUserToken.userProfileId) {
        const userProfileResponse = await clinicApis.getUserProfile(authUserToken.companyId, authUserToken.userProfileId);
        setUserProfile(userProfileResponse);
      }
    };
    loadData();
  }, [authUserToken]);

  return (
    <div>
      <UnAuthRedirect />
      <ScreenHeader screenName="Settings" />

      <Authenticated shouldHaveRoles={["ADMIN"]}>
        <div className="cardsGrid">
          <CompanyDetails />
          <Theme />
        </div>
      </Authenticated>

      <Authenticated shouldHaveRoles={["ADMIN"]}>
        <div className="cardsGrid">
          <EmployeeGroupSettings />
        </div>
      </Authenticated>

      <div className="cardsGrid">
        <MyProfile initialUserProfile={userProfile} onSaveSuccess={onSuccessfulSaveUser}/>
        <MyPassword />
        <div className="card">
          <h3>My Group</h3>
          <SwitchGroup initialUserProfile={userProfile} onSaveSuccess={onSuccessfulSaveUser}/>
        </div>
      </div>
    </div>
  );
}