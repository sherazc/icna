import { Outlet } from "react-router-dom";
import AppNav from "../navigation/AppNav";
import { useLoadCompanies } from "../hook/useLoadCompanies";
import { useAuthRefreshCoordinator } from "../hook/useAuthRefreshCoordinator";
import { useCompanySlugName } from "../hook/useCompanySlugName";
import { useApplyCompanyTheme } from "../hook/useApplyCompanyTheme";
import { ScreenFooterMain } from "../components/common/ScreenFooterMain";

export default function Layout01() {
  useLoadCompanies();
  useAuthRefreshCoordinator();
  useCompanySlugName();
  useApplyCompanyTheme();
  return (
    <div className="appContainer">
      <AppNav/>
      <div className="mainContent">
        <Outlet/>
        <ScreenFooterMain/>
      </div>
    </div>
  );
}