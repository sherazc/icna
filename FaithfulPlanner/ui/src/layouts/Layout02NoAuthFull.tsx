import "./Layout02NoAuthFull.css"
import { Outlet } from "react-router-dom";
import { ScreenHeaderMain } from "../components/common/ScreenHeaderMain";
import { ScreenFooterMain } from "../components/common/ScreenFooterMain";

export default function Layout02NoAuthFull() {
  return (
    <div className="layoutNoAuthFull">
      <ScreenHeaderMain/>
      <main className="layoutNoAuthFullContent"><Outlet/></main>
      <ScreenFooterMain/>
    </div>
  );
}
