import { type FC, useContext } from 'react';
import { Navigate } from "react-router-dom";
import { AppContext } from "../../store/context";
import type { AuthRole } from '../../service/service-types';
import { isAuthenticate } from '../../service/authentication-services';

interface Props {
    authenticated?: boolean;
    shouldHaveRoles?: AuthRole[];
    shouldHaveAnyRoles?: AuthRole[];
}

export const UnAuthRedirect: FC<Props> = ({authenticated, shouldHaveRoles, shouldHaveAnyRoles }) => {
    const [{ authUserToken }] = useContext(AppContext);
    const showContent = isAuthenticate(authenticated, authUserToken, shouldHaveRoles, shouldHaveAnyRoles);
    return (
        <>
            {!showContent && <Navigate to="/" />}
        </>
    );
};