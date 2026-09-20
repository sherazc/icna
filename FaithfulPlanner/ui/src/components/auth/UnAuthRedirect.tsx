import { type FC, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../../store/context";
import type { AuthRole } from '../../service/service-types';
import { isAuthenticated } from '../../service/authentication-services';
import { prefixCompanySlugNameUrl } from '../../service/navigation-service';
import { ActionNameLoginSuccessRedirectUrl } from '../../store/loginSuccessRedirectUrlReducer';

interface Props {
  authenticated?: boolean;
  shouldHaveRoles?: AuthRole[];
  shouldHaveAnyRoles?: AuthRole[];
}

export const UnAuthRedirect: FC<Props> = ({ authenticated, shouldHaveRoles, shouldHaveAnyRoles }) => {
  const [{ authUserToken, companySlugName, loginSuccessRedirectUrl }, dispatch] = useContext(AppContext);
  const location = useLocation();
  const [showContent, setShowContent] = useState<boolean>(true);

  useEffect(() => {
    setShowContent(isAuthenticated(authenticated, authUserToken, shouldHaveRoles, shouldHaveAnyRoles));
  }, [authenticated, authUserToken, shouldHaveRoles, shouldHaveAnyRoles]);

  useEffect(() => {
    if (!showContent && loginSuccessRedirectUrl.length < 1) {
      const relativeUrl = location.pathname + location.search;
      console.log("set loginSuccessRedirectUrl", relativeUrl);
      dispatch({ type: ActionNameLoginSuccessRedirectUrl.loginSuccessRedirectUrlSet, payload: relativeUrl });
    }
  }, [showContent, loginSuccessRedirectUrl, location]);

  return (
    <>
      {!showContent && <Navigate to={prefixCompanySlugNameUrl(companySlugName, "/login")} />}
    </>
  );
};