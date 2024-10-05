import React, {useContext} from "react";
import {AppContext} from "../store/context";
import styles from "./Loading.module.scss"
import {ActionNameLoading, LoadingAction} from "../store/loadingMessageReducer";

interface Props {
}

let loadingId = 0;
export const createLoadingActionShow = (message: string): LoadingAction => ({
    type: ActionNameLoading.loadingShow,
    payload: {
        id: ++loadingId,
        message
    }
});

export const createLoadingActionHide = (loadingId: number): LoadingAction => ({
    type: ActionNameLoading.loadingHide,
    payload: {
        id: loadingId,
        message: ""
    }
});


export const Loading: React.FC<Props> = () => {
    const [{loadingMessages}] = useContext(AppContext)
    if (!loadingMessages || loadingMessages.length < 1) return <></>
    return (
        <div className={styles.container}>
            <div className={styles.spinnerContainer}>
                <div className={styles.spinner}>
                    <div className={styles.loadingBars}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
            <div className={styles.messagesContainer}>
                {loadingMessages.map((lm, index) =>
                    <div key={index} className={styles.message}>
                        {lm.message}
                    </div>
                )}
            </div>
        </div>
    );
};