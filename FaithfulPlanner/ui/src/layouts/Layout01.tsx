import { Outlet } from "react-router-dom";
import AppNav from "../navigation/AppNav";

export default function Layout01() {
  return (
    <div className="appContainer">
      <AppNav/>
      <div className="mainContent"><Outlet/></div>
    </div>
  );
}