import * as React from "react"
import styles from "./Icon.module.scss"
import {CSSProperties} from "react";

interface Props {
    height?: string;
    width?: string;
    fill?: string;
    className?: string;
    pathD: string;
}

export const Icon: React.FC<Props> = (
    {
        height,
        width,
        fill,
        className,
        pathD
    }) => {

    const userStyles: CSSProperties = {};
    if (height) userStyles.height = height;
    if (width) userStyles.width = width;
    if (fill) userStyles.fill = fill;

    const userClassNames = className ? `${styles.icon} ${className}` : styles.icon;

    return (
        <svg
            style={userStyles}
            viewBox="0 0 100 100"
            className={userClassNames}>
            <path d={pathD}/>
        </svg>
    );
};
