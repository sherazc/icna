import AppNav from "../navigations/AppNav";
import {Outlet} from "react-router-dom";
import styles from "./EventLayout.module.scss";
import {useEffect} from "react";
import {Loading} from "../components/Loading";

const rootElementId = "registerRoot";
const messageDimensionKey = "messageDimensionKey";

export default function EventLayout() {

    useEffect(() => {
        const rootContainer = document.getElementById(rootElementId);
        if (rootContainer) {
            new ResizeObserver(postSize).observe(rootContainer)
        }
    }, []);

    const postSize = () => {
        const rootContainer = document.getElementById(rootElementId);
        if (rootContainer) {
            const width = rootContainer.scrollWidth;
            const height = rootContainer.scrollHeight;
            const message: any = {}
            message[messageDimensionKey] = {width, height}

            window.parent.postMessage(message, "*");
        }
    }

    return (
        <>
            <div id={rootElementId} className={styles.appBackground}>
                <div className={styles.appContainer}>
                    <AppNav/>
                    <Outlet/>
                </div>
            </div>
            <Loading/>
        </>
    );
}