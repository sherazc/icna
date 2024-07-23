import AppNav from "../navigations/AppNav";
import {Outlet} from "react-router-dom";
import styles from "./AppLayout.module.scss";

export default function AppLayout() {
    return(
        <div className={styles.appBackground}>
            <div className={styles.appContainer}>
                <AppNav />
                <Outlet />
            </div>
        </div>
    );
}