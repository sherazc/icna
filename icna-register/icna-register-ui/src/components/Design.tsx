import React from "react";
import styles from "./Design.module.scss";

interface Props {
}

export const Design: React.FC<Props> = () => {
    return (
        <div className={styles.testStyle}>Design</div>
    );
}