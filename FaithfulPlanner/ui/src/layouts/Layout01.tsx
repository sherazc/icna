import { Outlet } from "react-router-dom";
import AppNav from "../navigation/AppNav";
import { useLoadCompanies } from "../hook/useLoadCompanies";

export default function Layout01() {
  useLoadCompanies();
  return (
    <div className="appContainer">
      <AppNav/>
      <div className="mainContent"><Outlet/></div>
    </div>
  );
}