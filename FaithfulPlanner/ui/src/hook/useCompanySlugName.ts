import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../store/context";
import { ActionNameCompanySlugName } from "../store/companySlugNameReducer";

export const useCompanySlugName = () => {
 
  const { companySlugNameUrl } = useParams();
  const [{ clinicApis }, dispatch] = useContext(AppContext);

  const loadData = async () => {
    // Check if slugCompany is already loaded. if true then do not load it
    // Check if slugCompany is different. If true then logout and redirect to /:companySlugName/login
    // analysis if /login should redirect to /dashboard
    // analysis how to redirect to auth page after successful login. Currently it is being done in <UnAuthRedirect/>
    if (companySlugNameUrl && companySlugNameUrl.length > 0) {
      
      try {
        const company = await clinicApis.getCompanyBySlug(companySlugNameUrl);
        dispatch({type: ActionNameCompanySlugName.companySlugNameUrl, payload: company});
      } catch (error) {
        console.log(`Company not found by slugName = ${companySlugNameUrl}`)
      }
    }
  }

  useEffect(() => {
    loadData()
  }, [companySlugNameUrl]);
}