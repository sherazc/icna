import AppNav from "../navigations/AppNav";
import {Outlet} from "react-router-dom";

export default function AppLayout() {
    return(
        <div>
            <AppNav />
            <Outlet />
        </div>
    );
}