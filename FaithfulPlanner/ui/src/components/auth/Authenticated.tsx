import React, {useContext} from "react";
import type { AuthRole } from "../../service/service-types";
import {AppContext} from "../../store/context";
import {
    isAuthenticated
} from "../../service/authentication-services";

interface Props {
    authenticated?: boolean;
    children: React.ReactNode;
    shouldHaveRoles?: AuthRole[];
    shouldHaveAnyRoles?: AuthRole[];
    selfUserProfileId?: number;
}

export const Authenticated: React.FC<Props> = (
    {authenticated, children,
    shouldHaveRoles, shouldHaveAnyRoles , selfUserProfileId}) => {

    const [ {authUserToken}] = useContext(AppContext);
    let showContent: boolean;
    if (selfUserProfileId) {
        showContent = selfUserProfileId === authUserToken.userProfileId 
            || isAuthenticated(authenticated, authUserToken, shouldHaveRoles, shouldHaveAnyRoles);
    } else {
        showContent = isAuthenticated(authenticated, authUserToken, shouldHaveRoles, shouldHaveAnyRoles)
    }
    return showContent ? <>{children}</> : <></>;
};
