import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Authenticated } from "../components/auth/Authenticated";
import { useEmployeeGroups } from "../hook/useEmployeeGroups";

export default function AppNav() {
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
    return location.pathname === path ? "active" : "";
  };

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
      <div
        className={`sidebarOverlay ${mobileMenuOpen ? "active" : ""}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${mobileMenuOpen ? "active" : ""}`} id="sidebar">
        <div className="sidebarHeader">
          <h1>FaithfulPlanner</h1>
        </div>


        <ul className="navMenu">
          <Authenticated authenticated={false}>
            <li className="navItem">
              <Link to="/login" className={`navLink ${isActive("/login")} ${isActive("/")}`} onClick={closeMobileMenu}>
                Login
              </Link>
            </li>
          </Authenticated>
          <Authenticated authenticated={false}>
            <li className="navItem">
              <Link to="/company-registration" className={`navLink ${isActive("/company-registration")}`} onClick={closeMobileMenu}>
                Register Organization
              </Link>
            </li>
          </Authenticated>

          {/*
          <li className="navItem">
            <Link to="/org-selection" className={`navLink ${isActive("/org-selection")}`} onClick={closeMobileMenu}>
              Select Organization
            </Link>
          </li>
*/}
          <Authenticated>
            <li className="navItem">
              <Link to="/dashboard" className={`navLink ${isActive("/dashboard")}`} onClick={closeMobileMenu}>
                Dashboard
              </Link>
            </li>
          </Authenticated>
          {/*
          <li className="navItem superAdminOnly">
            <Link to="/org-management" className={`navLink ${isActive("/org-management")}`} onClick={closeMobileMenu}>
              Organization Management
            </Link>
          </li>
*/}
          <Authenticated>
            <li className="navItem">
              <Link to="/providers" className={`navLink ${isActive("/providers")}`} onClick={closeMobileMenu}>
                Providers
              </Link>
            </li>
          </Authenticated>
          <Authenticated>
            <li className="navItem">
              <Link to="/volunteers" className={`navLink ${isActive("/volunteers")}`} onClick={closeMobileMenu}>
                Volunteers
              </Link>
            </li>
          </Authenticated>

          <Authenticated>
            {employeeGroups && employeeGroups.length > 0 && employeeGroups.map((employeeGroup) => (
              <li className="navItem">
                <Link to="/volunteers" className={`navLink ${isActive("/volunteers")}`} onClick={closeMobileMenu}>
                  {employeeGroup.groupName}
                </Link>
              </li>
            ))}
          </Authenticated>


          {/*
          <li className="navItem">
            <Link to="/schedules" className={`navLink ${isActive("/schedules")}`} onClick={closeMobileMenu}>
              Schedules
            </Link>
          </li>
          <li className="navItem">
            <Link to="/shift-details" className={`navLink ${isActive("/shift-details")}`} onClick={closeMobileMenu}>
              Shift Details
            </Link>
          </li>
          <li className="navItem">
            <Link to="/notifications" className={`navLink ${isActive("/notifications")}`} onClick={closeMobileMenu}>
              Notifications
            </Link>
          </li>
          <li className="navItem">
            <Link to="/settings" className={`navLink ${isActive("/settings")}`} onClick={closeMobileMenu}>
              Settings
            </Link>
          </li>
          <li className="navItem">
            <Link to="/org-settings" className={`navLink ${isActive("/org-settings")}`} onClick={closeMobileMenu}>
              Organization Settings
            </Link>
          </li>
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
