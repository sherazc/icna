import { useContext, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AppContext } from "../store/context";
import { ActionNameCompanySlugName } from "../store/companySlugNameReducer";

export const useCompanySlugName = () => {

  const { companySlugNameUrl } = useParams();
  const location = useLocation();
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
        dispatch({ type: ActionNameCompanySlugName.companySlugNameUrl, payload: company });
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
      if ((!companySlugNameLoaded || !companySlugNameLoaded.id) && authUserToken.companyId > 0 && authUserToken.token) {
        companySlugNameLoaded = await clinicApis.getCompanyById(authUserToken.companyId);
        dispatch({type: ActionNameCompanySlugName.companySlugNameUrl, payload: companySlugNameLoaded})
      }

      if (location.pathname) {

      }
      console.log("location", location);
      console.log("auToken", authUserToken);
      console.log("companySlugName", companySlugName);

    };

    navigateIfNeeded();

  }, [location, authUserToken, companySlugName]);
};