import { type FC, useContext } from 'react';
import { Navigate } from "react-router-dom";
import { AppContext } from "../../store/context";
import type { AuthRole } from '../../service/service-types';
import { isAuthenticated } from '../../service/authentication-services';
import { prefixCompanySlugNameUrl } from '../../service/navigation-service';

interface Props {
    authenticated?: boolean;
    shouldHaveRoles?: AuthRole[];
    shouldHaveAnyRoles?: AuthRole[];
}

export const UnAuthRedirect: FC<Props> = ({authenticated, shouldHaveRoles, shouldHaveAnyRoles }) => {
    const [{ authUserToken, companySlugName }] = useContext(AppContext);
    const showContent = isAuthenticated(authenticated, authUserToken, shouldHaveRoles, shouldHaveAnyRoles);
    return (
        <>
            {!showContent && <Navigate to={prefixCompanySlugNameUrl(companySlugName, "/login")} />}
        </>
    );
};