import { UnAuthRedirect } from "../auth/UnAuthRedirect";
import { ScreenHeader } from "../common/ScreenHeader";
import { EmployeeGroupSettings } from "./EmployeeGroupSettings";

export default function Settings() {
  return (
    <div id="settings">
      <UnAuthRedirect />
      <ScreenHeader screenName="Settings" />
      <div className="cardsGrid">
        <EmployeeGroupSettings/>
      </div>
    </div>
  );
}