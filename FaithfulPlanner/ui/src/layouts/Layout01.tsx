import { Outlet } from "react-router-dom";
import AppNav from "../navigation/AppNav";
import { useLoadCompanies } from "../hook/useLoadCompanies";
import { useAuthRefreshCoordinator } from "../hook/useAuthRefreshCoordinator";

export default function Layout01() {
  useLoadCompanies();
  useAuthRefreshCoordinator();
  return (
    <div className="appContainer">
      <AppNav/>
      <div className="mainContent"><Outlet/></div>
    </div>
  );
}