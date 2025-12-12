import { Outlet } from "react-router-dom";
import AppNav from "../navigation/AppNav";

export default function Layout01() {
  return (
    <div>
    Layout 01
    <AppNav/>
    <Outlet/>
    </div>
  );
}