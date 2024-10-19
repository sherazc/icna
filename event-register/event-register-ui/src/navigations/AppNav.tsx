import {useParams} from "react-router-dom";
import React, {useContext} from "react";
import {CustomNavLink} from "./CustomNavLink";
import styles from "./AppNav.module.scss";
import {Authenticated} from "../components/auth/Authentecated";
import {AppContext} from "../store/context";

/*
If this user is admin show manage Event component

secure all APIs. Use auth token in UI to make API calls

*/


export default function AppNav() {
    const {eventId} = useParams();
    const [{authUserToken}] = useContext(AppContext);

    return (
        <nav className={styles.navContainer}>
            <CustomNavLink to={`/event/${eventId}`} linkText="Home"/>
            <Authenticated authenticated={false}>
                <CustomNavLink to={`/event/${eventId}/register/new`} linkText="New Register"/>
            </Authenticated>
            <Authenticated authenticated={true} shouldHaveAnyRoles={['ASSISTANT', 'ADMIN']}>
                <CustomNavLink to={`/event/${eventId}/register/new`} linkText="New Register"/>
            </Authenticated>
            {authUserToken.registrationId > 0 && (
                <Authenticated authenticated={true}>
                    <CustomNavLink to={`/event/${eventId}/register/${authUserToken.registrationId}`} linkText="Edit Register"/>
                </Authenticated>
            )}
            <Authenticated authenticated={true} shouldHaveAnyRoles={['ASSISTANT', 'ADMIN']}>
                <CustomNavLink to={`/event/${eventId}/attendees`} linkText="Attendees"/>
            </Authenticated>
            <Authenticated authenticated={true}>
                <CustomNavLink to={`/event/${eventId}/user-profile`} linkText="My Profile"/>
            </Authenticated>
        </nav>
    );
}
