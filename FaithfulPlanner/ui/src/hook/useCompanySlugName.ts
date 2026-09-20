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
  };

  useEffect(() => {
    loadData()
  }, [companySlugNameUrl]);

  useEffect(() => {
    navigateIfNeeded();
  }, [location, authUserToken, companySlugName, companySlugNameUrl]);
};