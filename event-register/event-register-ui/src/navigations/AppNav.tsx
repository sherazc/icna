import {useParams} from "react-router-dom";
import React from "react";
import {CustomNavLink} from "./CustomNavLink";
import styles from "./AppNav.module.scss";
import {Authenticated} from "../components/auth/Authentecated";

export default function AppNav() {
    const {eventId} = useParams();

    return (
        <nav className={styles.navContainer}>
            <CustomNavLink to={`/event/${eventId}`} linkText="Home"/>
            <Authenticated authenticated={false}>
                <CustomNavLink to={`/event/${eventId}/register/new`} linkText="Register"/>
            </Authenticated>
            <Authenticated authenticated={true} shouldHaveAnyRoles={['ASSISTANT', 'ADMIN']}>
                <CustomNavLink to={`/event/${eventId}/register/new`} linkText="Register"/>
            </Authenticated>
            <Authenticated authenticated={true} shouldHaveAnyRoles={['ASSISTANT', 'ADMIN']}>
                <CustomNavLink to={`/event/${eventId}/attendees`} linkText="Attendees"/>
            </Authenticated>
            <Authenticated authenticated={true}>
                <CustomNavLink to={`/event/${eventId}/user-profile`} linkText="My Profile"/>
            </Authenticated>
        </nav>
    );
}
