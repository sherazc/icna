import React from "react";
import {Link, useMatch, useResolvedPath} from "react-router-dom";
import styles from "./CustomNavLink.module.scss";

interface Props {
    to: string;
    linkText: string;

}

export const CustomNavLink: React.FC<Props> = ({to, linkText}) => {
    let resolved = useResolvedPath(to);
    let match = useMatch({path: resolved.pathname, end: true});

    const activeClassName = match ? styles.navTabActive : "";

    return (
        <Link to={to} className={`${styles.navTab} ${activeClassName}`}>
            {linkText}
        </Link>
    );
}