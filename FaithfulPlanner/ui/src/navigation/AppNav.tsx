import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { Authenticated } from "../components/auth/Authenticated";
import { useEmployeeGroups } from "../hook/useEmployeeGroups";
import { AppContext } from "../store/context";
import { prefixCompanySlugNameUrl } from "../service/navigation-service";
import { isAuthenticated } from "../service/authentication-services";

export default function AppNav() {
  const [{ companySlugName, authUserToken }] = useContext(AppContext);
  const containsCompanySlugName = companySlugName.id && companySlugName.id > 0;
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const employeeGroups = useEmployeeGroups()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    const isInPath = location.pathname.indexOf(path) > -1
    return isInPath ? "active" : "";
  };


  const rootUrl = isAuthenticated(true, authUserToken) ? prefixCompanySlugNameUrl(companySlugName, "/") : prefixCompanySlugNameUrl(companySlugName, "/login");

  return (
    <>
      {/* Hamburger Menu Button */}
      <button className="hamburgerBtn" onClick={toggleMobileMenu}>
        <div className="hamburgerIcon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Sidebar Overlay */}
      <div className={`sidebarOverlay ${mobileMenuOpen ? "active" : ""}`} onClick={closeMobileMenu}></div>

      {/* Sidebar */}
      <div className={`sidebar ${mobileMenuOpen ? "active" : ""}`} id="sidebar">
        <div className="sidebarHeader">
          <Link to={rootUrl} style={{ textDecoration: "none" }} onClick={closeMobileMenu}>
            <h1>{containsCompanySlugName ? companySlugName.companyName : "Faithful Planner"}</h1>
          </Link>
        </div>
        <ul className="navMenu">
          <Authenticated authenticated={false}>
            <li className="navItem">
              <Link to={prefixCompanySlugNameUrl(companySlugName, "/login")} className={`navLink ${isActive("/login")} ${location.pathname === "/" ? "active" : ""}`} onClick={closeMobileMenu}>
                Login
              </Link>
            </li>
          </Authenticated>
          {!containsCompanySlugName && (
            <Authenticated authenticated={false}>
              <li className="navItem">
                <Link to="/company-registration" className={`navLink ${isActive("/company-registration")}`} onClick={closeMobileMenu}>
                  Register Organization
                </Link>
              </li>
            </Authenticated>
          )}
          {/*
          <li className="navItem">
            <Link to="/org-selection" className={`navLink ${isActive("/org-selection")}`} onClick={closeMobileMenu}>
              Select Organization
            </Link>
          </li>
*/}
          {employeeGroups.length > 0 && (
            <Authenticated>
              <li className="navItem">
                <Link to={prefixCompanySlugNameUrl(companySlugName, "/dashboard")} className={`navLink ${isActive("/dashboard")}`} onClick={closeMobileMenu}>
                  Dashboard
                </Link>
              </li>
            </Authenticated>
          )}
          {/*
          <li className="navItem superAdminOnly">
            <Link to="/org-management" className={`navLink ${isActive("/org-management")}`} onClick={closeMobileMenu}>
              Organization Management
            </Link>
          </li>
*/}
          <Authenticated>
            {employeeGroups && employeeGroups.length > 0 && employeeGroups.map((employeeGroup, index) => {
              const link = `/employee-group/${employeeGroup.id}`
              return <li className="navItem" key={index}>
                <Link to={prefixCompanySlugNameUrl(companySlugName, link)} className={`navLink ${isActive(link)}`} onClick={closeMobileMenu}>
                  {employeeGroup.groupName}
                </Link>
              </li>
            })}
          </Authenticated>
          {/*
          <li className="navItem">
            <Link to="/schedules" className={`navLink ${isActive("/schedules")}`} onClick={closeMobileMenu}>
              Schedules
            </Link>
          </li>
          */}
          {/*
          <li className="navItem">
            <Link to="/shift-details" className={`navLink ${isActive("/shift-details")}`} onClick={closeMobileMenu}>
              Shift Details
            </Link>
          </li>
          */}
          {/*
          <li className="navItem">
            <Link to="/notifications" className={`navLink ${isActive("/notifications")}`} onClick={closeMobileMenu}>
              Notifications
            </Link>
          </li>
          */}

          <Authenticated>
            <li className="navItem">
              <Link to={prefixCompanySlugNameUrl(companySlugName, "/settings")} className={`navLink ${isActive("/settings")}`} onClick={closeMobileMenu}>
                Settings
              </Link>
            </li>
          </Authenticated>
          {/*
          <li className="navItem">
            <Link to="/volunteer-reports" className={`navLink ${isActive("/volunteer-reports")}`} onClick={closeMobileMenu}>
              Volunteer Reports
            </Link>
          </li>
*/}
        </ul>
      </div>
    </>
  );
}
