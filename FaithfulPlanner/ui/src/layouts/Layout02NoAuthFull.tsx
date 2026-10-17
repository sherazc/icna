import { Outlet } from "react-router-dom";

export default function Layout02NoAuthFull() {
  return (
    <div className="appContainer">
      <div className="mainContent"><Outlet/></div>
    </div>
  );
}