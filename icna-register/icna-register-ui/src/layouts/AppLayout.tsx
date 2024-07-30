import AppNav from "../navigations/AppNav";
import {Outlet} from "react-router-dom";
import styles from "./AppLayout.module.scss";
import {useEffect} from "react";

export default function AppLayout() {

    useEffect(() => {
        const rootContainer = document.getElementById("registerRoot");
        if (rootContainer) {
            new ResizeObserver(postSize).observe(rootContainer)
        }
    }, []);

    const postSize = () => {
        const rootContainer = document.getElementById("registerRoot");
        if (rootContainer) {
            const width = rootContainer.scrollWidth;
            const height = rootContainer.scrollHeight;
            console.log("width", width);
            console.log("height", height);
            window.parent.postMessage({"dimensions": {width, height}}, "*");
        }
    }

    return(
        <div id="registerRoot" className={styles.appBackground}>
            <div className={styles.appContainer}>
                <AppNav />
                <Outlet />
            </div>
        </div>
    );
}