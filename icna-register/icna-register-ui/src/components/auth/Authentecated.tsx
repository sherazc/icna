import React, {useContext} from "react";
import {AuthRole, AuthUserTokenDto} from "../../service/service-types";
import {AppContext} from "../../store/context";
import {isContainsAllRoles, isValidAuthUserToken} from "../../service/authentication-services";

interface Props {
    authenticated?: boolean;
    children: React.ReactNode;
    shouldHaveRoles?: AuthRole[];
    shouldNotHaveRoles?: AuthRole[];
}

export const Authenticated: React.FC<Props> = (
    {authenticated = true, children,
    shouldHaveRoles = [], shouldNotHaveRoles = []}) => {

    const [ {authUserToken}] = useContext(AppContext);

    if (!authenticated && !isValidAuthUserToken(authUserToken)) return <>{children}</>;
    if (authenticated && !isValidAuthUserToken(authUserToken)) return <></>;

    const containsAllRoles = isContainsAllRoles(authUserToken, shouldHaveRoles);

    return <>{children}</>;
}

