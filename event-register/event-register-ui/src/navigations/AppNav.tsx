import {useParams} from "react-router-dom";
import React from "react";
import {CustomNavLink} from "./CustomNavLink";
import styles from "./AppNav.module.scss";

export default function AppNav() {
    const {eventId} = useParams();

    return (
        <nav className={styles.navContainer}>
            <CustomNavLink to={`/event/${eventId}`} linkText="Home"/>
            <CustomNavLink to={`/event/${eventId}/register/new`} linkText="Register"/>
            <CustomNavLink to={`/event/${eventId}/attendees`} linkText="Attendees"/>
        </nav>
    );
}
