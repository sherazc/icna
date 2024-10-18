import {useParams} from "react-router-dom";
import React, {useContext} from "react";
import {CustomNavLink} from "./CustomNavLink";
import styles from "./AppNav.module.scss";
import {Authenticated} from "../components/auth/Authentecated";
import {AuthRole} from "../service/service-types";
import {AppContext} from "../store/context";

export default function AppNav() {
    const {eventId} = useParams();
    const [{authUserToken}] = useContext(AppContext);

    return (
        <nav className={styles.navContainer}>
            <CustomNavLink to={`/event/${eventId}`} linkText="Home"/>
            <Authenticated authenticated={false}>
                <CustomNavLink to={`/event/${eventId}/register/new`} linkText="Register"/>
            </Authenticated>
            <Authenticated authenticated={true} shouldHaveAnyRoles={[AuthRole.ASSISTANT, AuthRole.ADMIN]}>
                <CustomNavLink to={`/event/${eventId}/register/new`} linkText="Register"/>
            </Authenticated>
            <Authenticated authenticated={true} shouldHaveAnyRoles={[AuthRole.ASSISTANT, AuthRole.ADMIN]}>
                <CustomNavLink to={`/event/${eventId}/attendees`} linkText="Attendees"/>
            </Authenticated>
            <Authenticated authenticated={true}>
                <CustomNavLink to={`/event/${eventId}/user-profile/${authUserToken.userProfileId}`} linkText="My Profile"/>
            </Authenticated>
        </nav>
    );
}
