import React, { useContext } from "react";
import { AppContext } from "../../store/context";
import { ActionNameAuthUser } from "../../store/authUserReducer";
import { useNavigate } from "react-router-dom";

interface Props {
  screenName: string;
  children?: React.ReactNode;
}

export const ScreenHeader: React.FC<Props> = ({ screenName, children }) => {
  const [{ authUserToken }, dispatch] = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({
      type: ActionNameAuthUser.authUserLogout
    });
    navigate("/");
  }

  return (
    <div className="header">
      <h2>{screenName} <span className="orgBadge" id="currentOrgBadge">{authUserToken.companyName}</span></h2>
      <div className="headerActions">
        {children}
        <button className="btn btnLogout" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};
