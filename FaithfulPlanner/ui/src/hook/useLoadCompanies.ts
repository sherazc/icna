import { useContext, useEffect } from "react";
import { AppContext } from "../store/context";
import { ActionNameCompany } from "../store/companyReducer";

export const useLoadCompanies = () => {
  const [{ clinicApis }, dispatch] = useContext(AppContext);

  useEffect(() => {
    try {
      loadCompanies();
    } catch (error) {
      console.error("Failed to load companies:", error);
    }
  }, []);

  const loadCompanies = async () => {
    const fetchedCompanies = await clinicApis.getAllCompanies();
    dispatch({ type: ActionNameCompany.setCompanies, payload: fetchedCompanies });
  }
}