import { useContext, useEffect } from "react";
import { useLocation, useParams, type Location } from "react-router-dom";
import { AppContext } from "../store/context";
import { ActionNameCompanySlugName } from "../store/companySlugNameReducer";
import type { AuthUserTokenDto, CompanyDto } from "../service/service-types";

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
        console.log("Calling slugname api")
        const company = await clinicApis.getCompanyBySlug(companySlugNameUrl);
        dispatch({type: ActionNameCompanySlugName.companySlugNameUrl, payload: company});
      } catch (error) {
        console.log(`Company not found by slugName = ${companySlugNameUrl}`)
      }
    }
  };

  const navigateIfNeeded = async (log: Location<any>, auToken: AuthUserTokenDto, compSlugName: CompanyDto) => {
    let compSlugNameLoaded = compSlugName;
    if ((!compSlugNameLoaded || !compSlugNameLoaded.id) && auToken.companyId > 0 && auToken.token) {
      // companySlugNameLoaded = 
    }

    if (log.pathname) {

    }
    console.log("location", log);
    console.log("auToken", auToken);
    console.log("companySlugName", compSlugName);
  }

  useEffect(() => {
    loadData()
  }, [companySlugNameUrl]);
  
  useEffect(() => {
    navigateIfNeeded(location, authUserToken, companySlugName)
  }, [location, authUserToken, companySlugName]);
};