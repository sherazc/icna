import { Authenticated } from "../auth/Authenticated";
import { UnAuthRedirect } from "../auth/UnAuthRedirect";
import { ScreenHeader } from "../common/ScreenHeader";
import { CompanyDetails } from "./CompanyDetails";
import { EmployeeGroupSettings } from "./EmployeeGroupSettings";
import { MyPassword } from "./MyPassword";
import { MyProfile } from "./MyProfile";
import { Theme } from "./Theme";

export default function Settings() {
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
        <MyProfile />
        <MyPassword />
      </div>
    </div>
  );
}