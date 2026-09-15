import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../store/context";

export const useCompanySlugName = () => {
 
  const { companySlugName } = useParams();
  const [{ clinicApis }, dispatch] = useContext(AppContext);

  const loadData = async () => {
    if (companySlugName && companySlugName.length > 0) {
      
      try {
        const company = await clinicApis.getCompanyBySlug(companySlugName);
        console.log(company);
      } catch (error) {
        console.log(`Company not found by slugName = ${companySlugName}`)
      }
    }
  }

  useEffect(() => {
    loadData()
  }, [companySlugName]);
}