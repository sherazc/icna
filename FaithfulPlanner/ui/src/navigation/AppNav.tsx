export default function AppNav() {
  return (
    <>
    {/* <!-- Hamburger Menu Button --> */}
        <button className="hamburgerBtn" 
        // onclick="toggleMobileMenu()"
        >
            <div className="hamburgerIcon">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </button>

        {/* <!-- Sidebar Overlay --> */}
        <div className="sidebarOverlay" 
        // onclick="closeMobileMenu()"
        ></div>

        {/* <!-- Sidebar --> */}
        <div className="sidebar" id="sidebar">
            <div className="sidebarHeader">
                <h1>FaithfulPlanner</h1>
            </div>
            <div className="orgSelector">
                <label>Current Organization</label>
                <select id="orgSelector" 
                // onchange="switchOrganization()"
                >
                    <option value="">Select Organization</option>
                    <option value="mercy-clinic">Mercy Free Clinic</option>
                    <option value="hope-center">Hope Community Center</option>
                    <option value="faith-health">Faith & Health Alliance</option>
                </select>
            </div>
            <ul className="navMenu">
                <li className="navItem">
                    <a className="navLink active" onclick="switchScreen('login')">Login</a>
                </li>
                <li className="navItem">
                    <a className="navLink" onclick="switchScreen('org-registration')">Register Organization</a>
                </li>
                <li className="navItem">
                    <a className="navLink" onclick="switchScreen('org-selection')">Select Organization</a>
                </li>
                <li className="navItem">
                    <a className="navLink" onclick="switchScreen('dashboard')">Dashboard</a>
                </li>
                <li className="navItem superAdminOnly">
                    <a className="navLink" onclick="switchScreen('org-management')">Organization Management</a>
                </li>
                <li className="navItem">
                    <a className="navLink" onclick="switchScreen('providers')">Providers</a>
                </li>
                <li className="navItem">
                    <a className="navLink" onclick="switchScreen('volunteers')">Volunteers</a>
                </li>
                <li className="navItem">
                    <a className="navLink" onclick="switchScreen('schedules')">Schedules</a>
                </li>
                <li className="navItem">
                    <a className="navLink" onclick="switchScreen('shift-details')">Shift Details</a>
                </li>
                <li className="navItem">
                    <a className="navLink" onclick="switchScreen('notifications')">Notifications</a>
                </li>
                <li className="navItem">
                    <a className="navLink" onclick="switchScreen('settings')">Settings</a>
                </li>
                <li className="navItem">
                    <a className="navLink" onclick="switchScreen('org-settings')">Organization Settings</a>
                </li>
                <li className="navItem">
                    <a className="navLink" onclick="switchScreen('volunteer-reports')">Volunteer Reports</a>
                </li>
                <li className="navItem">
                    <a className="navLink" onclick="switchScreen('design')">Design</a>
                </li>
            </ul>
        </div>
    </>
  );
}
