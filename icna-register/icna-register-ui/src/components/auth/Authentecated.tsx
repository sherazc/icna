import React, {useContext} from "react";
import {AuthRole} from "../../service/service-types";
import {AppContext} from "../../store/context";
import {isValidAuthUserToken} from "../../service/common-services";

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



    return <>{children}</>;
}

