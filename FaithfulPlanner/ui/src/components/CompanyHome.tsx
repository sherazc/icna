import { useContext } from "react";
import { AppContext } from "../store/context";

interface Props { }
export const CompanyHome: React.FC<Props> = () => {
  const [{ companySlugName }] = useContext(AppContext);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>{companySlugName.companyName}</h1>
    </div>
  );
}