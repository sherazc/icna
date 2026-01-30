import React, {useContext} from "react";
import type { AuthRole } from "../../service/service-types";
import {AppContext} from "../../store/context";
import {
    isAuthenticate
} from "../../service/authentication-services";

interface Props {
    authenticated?: boolean;
    children: React.ReactNode;
    shouldHaveRoles?: AuthRole[];
    shouldHaveAnyRoles?: AuthRole[];
}

export const Authenticated: React.FC<Props> = (
    {authenticated, children,
    shouldHaveRoles, shouldHaveAnyRoles }) => {

    const [ {authUserToken}] = useContext(AppContext);
    const showContent = isAuthenticate(authenticated, authUserToken, shouldHaveRoles, shouldHaveAnyRoles);
    return showContent ? <>{children}</> : <></>;
};
