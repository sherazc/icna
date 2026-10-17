import "./ScreenHeaderMain.css"
import React from "react";
import { Link } from "react-router-dom";

interface Props { }

export const ScreenHeaderMain: React.FC<Props> = () => {
  return (
    <header className="screenHeaderMain">
      <Link to="/" className="screenHeaderMainBrand">Faithful Planner</Link>
      <div className="screenHeaderMainActions">
        <Link to="/login" className="screenHeaderMainBtn screenHeaderMainBtnGhost">Log in</Link>
        <Link to="/company-registration" className="screenHeaderMainBtn screenHeaderMainBtnSolid">Sign up</Link>
      </div>
    </header>
  );
};
