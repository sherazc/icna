import { useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../store/context";
import { ActionNameCompanySlugName } from "../store/companySlugNameReducer";
import { isAuthenticated } from "../service/authentication-services";
import { ActionNameAuthUser } from "../store/authUserReducer";
import { prefixCompanySlugNameUrl } from "../service/navigation-service";

export const useCompanySlugName = () => {

  const { companySlugNameUrl } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [{ clinicApis, authUserToken, companySlugName }, dispatch] = useContext(AppContext);


  const loadData = async () => {
    // Create index Component. Route it to /. Check slug and auth and redirect to dashboard or login

    // Do above or below

    // Check slug and auth and redirect to dashboard or login


    // Check if slugCompany is already loaded. if true then do not load it
    // Check if slugCompany is different. If true then logout and redirect to /:companySlugName/login
    // analysis if /login should redirect to /dashboard
    // analysis how to redirect to auth page after successful login. Currently it is being done in <UnAuthRedirect/>
    if (companySlugNameUrl && companySlugNameUrl.length > 0) {

      try {
        const company = await clinicApis.getCompanyBySlug(companySlugNameUrl);
        dispatch({ type: ActionNameCompanySlugName.companySlugNameUrlSet, payload: company });
      } catch (error) {
        console.log(`Company not found by slugName = ${companySlugNameUrl}`)
      }
    }
  };

  useEffect(() => {
    loadData()
  }, [companySlugNameUrl]);

  useEffect(() => {
    const navigateIfNeeded = async () => {
      let companySlugNameLoaded = companySlugName;
      if ((!companySlugNameLoaded || !companySlugNameLoaded.id) && isAuthenticated(true, authUserToken)) {
        companySlugNameLoaded = await clinicApis.getCompanyById(authUserToken.companyId);
        dispatch({ type: ActionNameCompanySlugName.companySlugNameUrlSet, payload: companySlugNameLoaded })
      }

      if (companySlugNameUrl && companySlugNameUrl.length > 0 && companySlugNameLoaded.slugName.length > 0 && companySlugNameLoaded.slugName !== companySlugNameUrl) {
        dispatch({ type: ActionNameAuthUser.authUserLogout });
        dispatch({ type: ActionNameCompanySlugName.companySlugNameUrlRemove });
        navigate(prefixCompanySlugNameUrl(companySlugNameLoaded, "/login"));
      }

      // console.log("companySlugNameUrl", companySlugNameUrl);
      // console.log("location", location);
      // console.log("auToken", authUserToken);
      // console.log("companySlugName", companySlugNameLoaded);
      // console.log("=============");


      // if (isAuthenticated(true, authUserToken)
      //     && companySlugNameLoaded.id && companySlugNameLoaded.id > 0
      //     && companySlugNameLoaded.id !== authUserToken.companyId
      //     && companySlugNameLoaded.slugName) {

      // dispatch({ type: ActionNameAuthUser.authUserLogout });
      // navigate(`${companySlugNameLoaded.slugName}/login`)
      // } 

      // else if (location.pathname && location.pathname === "/" && companySlugNameLoaded.id && companySlugNameLoaded.id > 0) {
      //   if (isAuthenticated(true, authUserToken)) {
      //     navigate(`${companySlugNameLoaded.slugName}/dashboard`)
      //   } else {
      //     navigate(`${companySlugNameLoaded.slugName}/login`)
      //   }

      // }


    };

    navigateIfNeeded();

  }, [location, authUserToken, companySlugName, companySlugNameUrl]);
};