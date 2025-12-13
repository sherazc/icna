export default function Home() {
  return (
    <>
      {/* <!-- Login Screen --> */}
      <div id="login" className="screen active">
        <div className="loginContainer">
          <h1>FaithfulPlanner</h1>
          <form onsubmit="handleLogin(event)">
            <div className="formGroup">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div className="formGroup">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" required />
            </div>
            <div className="formGroup">
              <label htmlFor="organization">Organization</label>
              <select id="organization" required>
                <option value="">Select your organization</option>
                <option value="mercy-clinic">Mercy Free Clinic</option>
                <option value="hope-center">Hope Community Center</option>
                <option value="faith-health">Faith & Health Alliance</option>
              </select>
            </div>
            <div className="formGroup">
              <label htmlFor="role">Role</label>
              <select id="role" required>
                <option value="">Select your role</option>
                <option value="super-admin">Super Admin</option>
                <option value="org-admin">Organization Admin</option>
                <option value="provider">Provider/Doctor</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
            <div className="formActions">
              <button type="submit" className="btn btnPrimary">Login</button>
              <button type="button" className="btn btnSecondary" onclick="switchScreen('org-registration')">Register Organization</button>
            </div>
          </form>
        </div>
      </div>

      {/* <!-- Organization Registration Screen --> */}
      <div id="org-registration" className="screen">
        <div className="loginContainer">
          <h1>Register Organization</h1>
          <form onsubmit="handleOrgRegistration(event)">
            <div className="formGroup">
              <label htmlFor="orgName">Organization Name</label>
              <input type="text" id="orgName" placeholder="Enter organization name" required />
            </div>
            <div className="formGroup">
              <label htmlFor="orgType">Organization Type</label>
              <select id="orgType" required>
                <option value="">Select type</option>
                <option value="clinic">Free Clinic</option>
                <option value="hospital">Community Hospital</option>
                <option value="center">Health Center</option>
                <option value="mobile">Mobile Clinic</option>
              </select>
            </div>
            <div className="formGroup">
              <label htmlFor="orgAddress">Address</label>
              <input type="text" id="orgAddress" placeholder="Organization address" required />
            </div>
            <div className="formGroup">
              <label htmlFor="adminEmail">Admin Email</label>
              <input type="email" id="adminEmail" placeholder="Primary admin email" required />
            </div>
            <div className="formGroup">
              <label htmlFor="orgPhone">Phone Number</label>
              <input type="tel" id="orgPhone" placeholder="Organization phone" required />
            </div>
            <div className="formGroup">
              <label htmlFor="orgColor">Brand Color</label>
              <div className="flexRow15">
                <input type="color" id="orgColor" value="#667eea" onchange="updateColorPreview('orgColor', 'orgColorPreview')" />
                <div className="flexColumn">
                  <div id="orgColorPreview" className="colorPreview"></div>
                  <span id="orgColorValue" className="colorValue">#667eea</span>
                </div>
              </div>
            </div>
            <div className="formActions">
              <button type="submit" className="btn btnPrimary">Register Organization</button>
              <button type="button" className="btn btnSecondary" onclick="switchScreen('login')">Back to Login</button>
            </div>
          </form>
        </div>
      </div>

      {/* <!-- Organization Selection Screen --> */}
      <div id="org-selection" className="screen">
        <div className="header">
          <h2>Select Organization</h2>
          <button className="btn btnLogout" onclick="switchScreen('login')">Logout</button>
        </div>

        <div className="dashboardGrid">
          <div className="card" onclick="selectOrganization('mercy-clinic')">
            <h3>Mercy Free Clinic</h3>
            <div className="cardStat">
              <span className="cardStatLabel">Role</span>
              <span className="cardStatValue">Admin</span>
            </div>
            <div className="cardStat">
              <span className="cardStatLabel">Active Providers</span>
              <span className="cardStatValue">12</span>
            </div>
            <div className="cardStat">
              <span className="cardStatLabel">Volunteers</span>
              <span className="cardStatValue">28</span>
            </div>
          </div>

          <div className="card" onclick="selectOrganization('hope-center')">
            <h3>Hope Community Center</h3>
            <div className="cardStat">
              <span className="cardStatLabel">Role</span>
              <span className="cardStatValue">Provider</span>
            </div>
            <div className="cardStat">
              <span className="cardStatLabel">Active Providers</span>
              <span className="cardStatValue">8</span>
            </div>
            <div className="cardStat">
              <span className="cardStatLabel">Volunteers</span>
              <span className="cardStatValue">15</span>
            </div>
          </div>

          <div className="card" onclick="selectOrganization('faith-health')">
            <h3>Faith & Health Alliance</h3>
            <div className="cardStat">
              <span className="cardStatLabel">Role</span>
              <span className="cardStatValue">Volunteer</span>
            </div>
            <div className="cardStat">
              <span className="cardStatLabel">Active Providers</span>
              <span className="cardStatValue">6</span>
            </div>
            <div className="cardStat">
              <span className="cardStatLabel">Volunteers</span>
              <span className="cardStatValue">22</span>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Organization Management Screen (Super Admin Only) --> */}
      <div id="org-management" className="screen">
        <div className="header">
          <h2>Organization Management <span className="orgBadge">Super Admin</span></h2>
          <div className="headerActions">
            <button className="btn btnPrimary" onclick="openModal('addOrgModal')">+ Add Organization</button>
            <button className="btn btnLogout" onclick="switchScreen('login')">Logout</button>
          </div>
        </div>

        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Organization Name</th>
                <th>Type</th>
                <th>Admin Email</th>
                <th>Providers</th>
                <th>Volunteers</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mercy Free Clinic</td>
                <td>Free Clinic</td>
                <td>admin@mercyclinic.org</td>
                <td>12</td>
                <td>28</td>
                <td><span className="badge badgeSuccess">Active</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit">Edit</button>
                  <button className="actionBtn actionBtnDelete">Suspend</button>
                </td>
              </tr>
              <tr>
                <td>Hope Community Center</td>
                <td>Health Center</td>
                <td>admin@hopecenter.org</td>
                <td>8</td>
                <td>15</td>
                <td><span className="badge badgeSuccess">Active</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit">Edit</button>
                  <button className="actionBtn actionBtnDelete">Suspend</button>
                </td>
              </tr>
              <tr>
                <td>Faith & Health Alliance</td>
                <td>Mobile Clinic</td>
                <td>admin@faithhealth.org</td>
                <td>6</td>
                <td>22</td>
                <td><span className="badge badgeWarning">Pending</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit">Edit</button>
                  <button className="actionBtn actionBtnDelete">Suspend</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* <!-- Dashboard Screen --> */}
      <div id="dashboard" className="screen">
        <div className="header">
          <h2>Dashboard <span className="orgBadge" id="currentOrgBadge">Mercy Free Clinic</span></h2>
          <div className="headerActions">
            <button className="btn btnSecondary" onclick="switchScreen('org-selection')">Switch Organization</button>
            <button className="btn btnPrimary" onclick="openModal('addClinicModal')">+ New Clinic Date</button>
            <button className="btn btnLogout" onclick="switchScreen('login')">Logout</button>
          </div>
        </div>

        <div className="tableContainer">
          <div className="tableScroll">
            <table>
              <thead>
                <tr>
                  <th>Clinic Date</th>
                  <th>Providers Assigned</th>
                  <th>Volunteers Assigned</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr onclick="selectRow(this, 'Nov 30, 2025')">
                  <td>Nov 30, 2025</td>
                  <td>4 <small className="smallText">(Dr. Johnson, Dr. Chen, Dr. Williams, Dr. Martinez)</small></td>
                  <td>8 <small className="smallText">(Rodriguez, Thompson, Kim, Anderson +4 more)</small></td>
                  <td><span className="badge badgeSuccess">Scheduled</span></td>
                  <td>
                    <button className="actionBtn actionBtnEdit" onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                    <button className="actionBtn actionBtnDelete" onclick="event.stopPropagation()">Delete</button>
                  </td>
                </tr>
                <tr onclick="selectRow(this, 'Dec 7, 2025')">
                  <td>Dec 7, 2025</td>
                  <td>3 <small className="smallText">(Dr. Johnson, Dr. Chen, Dr. Brown)</small></td>
                  <td>6 <small className="smallText">(Rodriguez, Kim, Garcia, Lee +2 more)</small></td>
                  <td><span className="badge badgeSuccess">Scheduled</span></td>
                  <td>
                    <button className="actionBtn actionBtnEdit" onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                    <button className="actionBtn actionBtnDelete" onclick="event.stopPropagation()">Delete</button>
                  </td>
                </tr>
                <tr onclick="selectRow(this, 'Dec 14, 2025')">
                  <td>Dec 14, 2025</td>
                  <td>2 <small className="smallText">(Dr. Williams, Dr. Martinez)</small></td>
                  <td>4 <small className="smallText">(Thompson, Anderson, Garcia, Johnson)</small></td>
                  <td><span className="badge badgeWarning">Pending</span></td>
                  <td>
                    <button className="actionBtn actionBtnEdit" onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                    <button className="actionBtn actionBtnDelete" onclick="event.stopPropagation()">Delete</button>
                  </td>
                </tr>
                <tr onclick="selectRow(this, 'Dec 21, 2025')">
                  <td>Dec 21, 2025</td>
                  <td>5 <small className="text-secondary text-sm">(Dr. Johnson, Dr. Martinez, Dr. Smith, Dr. Davis, Dr. Wilson)</small></td>
                  <td>10 <small className="text-secondary text-sm">(Rodriguez, Thompson, Kim, Garcia +6 more)</small></td>
                  <td><span className="badge badgeSuccess">Scheduled</span></td>
                  <td>
                    <button className="actionBtn actionBtnEdit" onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                    <button className="actionBtn actionBtnDelete" onclick="event.stopPropagation()">Delete</button>
                  </td>
                </tr>
                <tr onclick="selectRow(this, 'Dec 28, 2025')">
                  <td>Dec 28, 2025</td>
                  <td>3 <small className="text-secondary text-sm">(Dr. Chen, Dr. Williams, Dr. Brown)</small></td>
                  <td>7 <small className="text-secondary text-sm">(Anderson, Lee, Johnson, Miller +3 more)</small></td>
                  <td><span className="badge badgeSuccess">Scheduled</span></td>
                  <td>
                    <button className="actionBtn actionBtnEdit" onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                    <button className="actionBtn actionBtnDelete" onclick="event.stopPropagation()">Delete</button>
                  </td>
                </tr>
                <tr onclick="selectRow(this, 'Jan 4, 2026')">
                  <td>Jan 4, 2026</td>
                  <td>4 <small className="text-secondary text-sm">(Dr. Johnson, Dr. Martinez, Dr. Taylor, Dr. White)</small></td>
                  <td>9 <small className="text-secondary text-sm">(Rodriguez, Kim, Garcia, Thompson +5 more)</small></td>
                  <td><span className="badge badgeWarning">Pending</span></td>
                  <td>
                    <button className="actionBtn actionBtnEdit" onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                    <button className="actionBtn actionBtnDelete" onclick="event.stopPropagation()">Delete</button>
                  </td>
                </tr>
                <tr onclick="selectRow(this, 'Jan 11, 2026')">
                  <td>Jan 11, 2026</td>
                  <td>2 <small className="text-secondary text-sm">(Dr. Davis, Dr. Wilson)</small></td>
                  <td>5 <small className="text-secondary text-sm">(Anderson, Lee, Miller, Clark, Hall)</small></td>
                  <td><span className="badge badgeWarning">Pending</span></td>
                  <td>
                    <button className="actionBtn actionBtnEdit" onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                    <button className="actionBtn actionBtnDelete" onclick="event.stopPropagation()">Delete</button>
                  </td>
                </tr>
                <tr onclick="selectRow(this, 'Jan 18, 2026')">
                  <td>Jan 18, 2026</td>
                  <td>6 <small className="text-secondary text-sm">(Dr. Johnson, Dr. Chen, Dr. Martinez, Dr. Smith +2 more)</small></td>
                  <td>12 <small className="text-secondary text-sm">(Rodriguez, Thompson, Kim, Garcia +8 more)</small></td>
                  <td><span className="badge badgePrimary">Draft</span></td>
                  <td>
                    <button className="actionBtn actionBtnEdit" onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                    <button className="actionBtn actionBtnDelete" onclick="event.stopPropagation()">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* <!-- Clinic Day Details Section --> */}
        <div className="card clinicDayDetails">
          <div className="flex flex-start gap-1fullWidth">
            <h3 id="selected-clinic-date" className="m-fullWidth">Select a clinic date to view details</h3>
            <span id="selected-clinic-status" className="badge badgeSuccess hidden"></span>
          </div>

          <div className="detailsGrid">
            {/* <!-- Providers Details --> */}
            <div className="detailSection">
              <h4 className="detailSectionTitle">Assigned Providers</h4>
              <div className="cardStat">
                <span className="cardStatLabel">Total Assigned</span>
                <span className="cardStatValue" id="detail-providers-count">0</span>
              </div>
              <div className="mt-15 searchWrapper">
                <div className="searchInputContainer">
                  <input type="text" id="provider-search" placeholder="Search and add providers..." className="searchInput" />
                  <div id="provider-dropdown" className="searchDropdown"></div>
                </div>
                <button type="button" className="dropdownToggleBtn" onclick="toggleAllProviders()" title="Show all providers">▼</button>
              </div>
              <div>
                <h5 className="cardStatLabel mt-15 mb-1fullWidth">Provider List</h5>
                <ul className="personList" id="detail-providers-list">
                  <li className="personItem">
                    <span className="personName">No providers assigned</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* <!-- Volunteers Details --> */}
            <div className="detailSection">
              <h4 className="detailSectionTitle">Assigned Volunteers</h4>
              <div className="cardStat">
                <span className="cardStatLabel">Total Assigned</span>
                <span className="cardStatValue" id="detail-volunteers-count">0</span>
              </div>
              <div className="mt-15 searchWrapper">
                <div className="searchInputContainer">
                  <input type="text" id="volunteer-search" placeholder="Search and add volunteers..." className="searchInput" />
                  <div id="volunteer-dropdown" className="searchDropdown"></div>
                </div>
                <button type="button" className="dropdownToggleBtn" onclick="toggleAllVolunteers()" title="Show all volunteers">▼</button>
              </div>
              <div>
                <h5 className="cardStatLabel mt-15 mb-1fullWidth">Volunteer List</h5>
                <ul className="personList" id="detail-volunteers-list">
                  <li className="personItem">
                    <span className="personName">No volunteers assigned</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Provider Management Screen --> */}
      <div id="providers" className="screen">
        <div className="header">
          <h2>Provider Management <span className="orgBadge" id="providerOrgBadge">Mercy Free Clinic</span></h2>
          <div className="headerActions">
            <button className="btn btnSecondary" onclick="switchScreen('org-selection')">Switch Organization</button>
            <button className="btn btnPrimary" onclick="openModal('addProviderModal')">+ Add Provider</button>
            <button className="btn btnLogout" onclick="switchScreen('login')">Logout</button>
          </div>
        </div>

        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Contact</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dr. Sarah Johnson</td>
                <td>General Medicine</td>
                <td>sarah@clinic.org</td>
                <td>Weekends</td>
                <td><span className="badge badgeSuccess">Available</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit">Edit</button>
                  <button className="actionBtn actionBtnDelete">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Dr. Michael Chen</td>
                <td>Pediatrics</td>
                <td>michael@clinic.org</td>
                <td>Saturdays</td>
                <td><span className="badge badgeSuccess">Available</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit">Edit</button>
                  <button className="actionBtn actionBtnDelete">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Dr. Patricia Williams</td>
                <td>Cardiology</td>
                <td>patricia@clinic.org</td>
                <td>By Request</td>
                <td><span className="badge badgeWarning">Limited</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit">Edit</button>
                  <button className="actionBtn actionBtnDelete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* <!-- Volunteer Management Screen --> */}
      <div id="volunteers" className="screen">
        <div className="header">
          <h2>Volunteer Management <span className="orgBadge" id="volunteerOrgBadge">Mercy Free Clinic</span></h2>
          <div className="headerActions">
            <button className="btn btnSecondary" onclick="switchScreen('org-selection')">Switch Organization</button>
            <button className="btn btnPrimary" onclick="openModal('addVolunteerModal')">+ Add Volunteer</button>
            <button className="btn btnLogout" onclick="switchScreen('login')">Logout</button>
          </div>
        </div>

        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Assigned Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>James Rodriguez</td>
                <td>james@volunteer.org</td>
                <td>(555) 123-4567</td>
                <td>Registration Assistant</td>
                <td><span className="badge badgeSuccess">Active</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit">Edit</button>
                  <button className="actionBtn actionBtnDelete">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Emma Thompson</td>
                <td>emma@volunteer.org</td>
                <td>(555) 234-5678</td>
                <td>Patient Support</td>
                <td><span className="badge badgeSuccess">Active</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit">Edit</button>
                  <button className="actionBtn actionBtnDelete">Delete</button>
                </td>
              </tr>
              <tr>
                <td>David Kim</td>
                <td>david@volunteer.org</td>
                <td>(555) 345-6789</td>
                <td>Data Entry</td>
                <td><span className="badge badgePrimary">Pending</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit">Edit</button>
                  <button className="actionBtn actionBtnDelete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* <!-- Schedule Management Screen --> */}
      <div id="schedules" className="screen">
        <div className="header">
          <h2>Schedule Management</h2>
          <div className="headerActions">
            <button className="btn btnPrimary" onclick="openModal('addScheduleModal')">+ Create Schedule</button>
            <button className="btn btnLogout" onclick="switchScreen('login')">Logout</button>
          </div>
        </div>

        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Clinic Date</th>
                <th>Time</th>
                <th>Provider</th>
                <th>Volunteers</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nov 30, 2025</td>
                <td>9:00 AM - 12:00 PM</td>
                <td>Dr. Sarah Johnson</td>
                <td>4</td>
                <td>20</td>
                <td><span className="badge badgeSuccess">Full</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit">Edit</button>
                  <button className="actionBtn actionBtnDelete">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Nov 30, 2025</td>
                <td>1:00 PM - 4:00 PM</td>
                <td>Dr. Michael Chen</td>
                <td>3</td>
                <td>18</td>
                <td><span className="badge badgeSuccess">Full</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit">Edit</button>
                  <button className="actionBtn actionBtnDelete">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Dec 7, 2025</td>
                <td>9:00 AM - 12:00 PM</td>
                <td>Dr. Patricia Williams</td>
                <td>2</td>
                <td>15</td>
                <td><span className="badge badgeWarning">Partial</span></td>
                <td>
                  <button className="actionBtn actionBtnEdit">Edit</button>
                  <button className="actionBtn actionBtnDelete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* <!-- Shift Details Screen --> */}
      <div id="shift-details" className="screen">
        <div className="header">
          <h2>Shift Details</h2>
          <button className="btn btnLogout" onclick="switchScreen('login')">Logout</button>
        </div>

        <div className="dashboardGrid">
          <div className="card">
            <h3>Shift Information</h3>
            <div className="cardStat">
              <span className="cardStatLabel">Date</span>
              <span className="cardStatValue">Nov 30, 2025</span>
            </div>
            <div className="cardStat">
              <span className="cardStatLabel">Time</span>
              <span className="cardStatValue">9:00 AM - 12:00 PM</span>
            </div>
            <div className="cardStat">
              <span className="cardStatLabel">Provider</span>
              <span className="cardStatValue">Dr. Sarah Johnson</span>
            </div>
            <div className="cardStat">
              <span className="cardStatLabel">Location</span>
              <span className="cardStatValue">Main Clinic</span>
            </div>
          </div>

          <div className="card">
            <h3>Assigned Volunteers</h3>
            <div className="cardStat">
              <span className="cardStatLabel">Total Assigned</span>
              <span className="cardStatValue">4</span>
            </div>
            <div className="cardStat">
              <span className="cardStatLabel">Confirmed</span>
              <span className="cardStatValue">3</span>
            </div>
            <div className="cardStat">
              <span className="cardStatLabel">Pending Response</span>
              <span className="cardStatValue">1</span>
            </div>
          </div>

          <div className="card">
            <h3>Capacity</h3>
            <div className="cardStat">
              <span className="cardStatLabel">Expected Patients</span>
              <span className="cardStatValue">20</span>
            </div>
            <div className="cardStat">
              <span className="cardStatLabel">Current Patients</span>
              <span className="cardStatValue">18</span>
            </div>
            <div className="cardStat">
              <span className="cardStatLabel">Remaining Slots</span>
              <span className="cardStatValue">2</span>
            </div>
          </div>
        </div>

        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Volunteer Name</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>James Rodriguez</td>
                <td>Registration Assistant</td>
                <td>(555) 123-4567</td>
                <td><span className="badge badgeSuccess">Confirmed</span></td>
              </tr>
              <tr>
                <td>Emma Thompson</td>
                <td>Patient Support</td>
                <td>(555) 234-5678</td>
                <td><span className="badge badgeSuccess">Confirmed</span></td>
              </tr>
              <tr>
                <td>David Kim</td>
                <td>Data Entry</td>
                <td>(555) 345-6789</td>
                <td><span className="badge badgePrimary">Pending</span></td>
              </tr>
              <tr>
                <td>Lisa Anderson</td>
                <td>Patient Support</td>
                <td>(555) 456-7890</td>
                <td><span className="badge badgeSuccess">Confirmed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* <!-- Notifications Screen --> */}
      <div id="notifications" className="screen">
        <div className="header">
          <h2>Notifications</h2>
          <button className="btn btnLogout" onclick="switchScreen('login')">Logout</button>
        </div>

        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Alert Type</th>
                <th>Message</th>
                <th>Recipient</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nov 23, 2:30 PM</td>
                <td>Shift Reminder</td>
                <td>Reminder: Clinic on Nov 30, 9:00 AM</td>
                <td>All Providers</td>
                <td><span className="badge badgeSuccess">Sent</span></td>
              </tr>
              <tr>
                <td>Nov 22, 10:15 AM</td>
                <td>Confirmation Request</td>
                <td>Please confirm your availability for Dec 7</td>
                <td>Dr. Sarah Johnson</td>
                <td><span className="badge badgePrimary">Pending</span></td>
              </tr>
              <tr>
                <td>Nov 21, 3:45 PM</td>
                <td>Volunteer Assignment</td>
                <td>You have been assigned to Nov 30 shift</td>
                <td>All Volunteers</td>
                <td><span className="badge badgeSuccess">Sent</span></td>
              </tr>
              <tr>
                <td>Nov 20, 9:00 AM</td>
                <td>Clinic Scheduled</td>
                <td>New clinic date scheduled: Dec 14</td>
                <td>All Users</td>
                <td><span className="badge badgeSuccess">Sent</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* <!-- Settings/Profile Screen --> */}
      <div id="settings" className="screen">
        <div className="header">
          <h2>Settings</h2>
          <button className="btn btnLogout" onclick="switchScreen('login')">Logout</button>
        </div>

        <div className="dashboardGrid">
          <div className="card">
            <h3>User Profile</h3>
            <div className="formGroup">
              <label>Full Name</label>
              <input type="text" value="Admin User" placeholder="Enter full name" />
            </div>
            <div className="formGroup">
              <label>Email</label>
              <input type="email" value="admin@clinic.org" placeholder="Enter email" />
            </div>
            <div className="formGroup">
              <label>Phone</label>
              <input type="tel" value="(555) 999-0000" placeholder="Enter phone" />
            </div>
            <button className="btn btnPrimary fullWidth marginTop15">Save Profile</button>
          </div>

          <div className="card">
            <h3>Account Settings</h3>
            <div className="formGroup">
              <label>Current Password</label>
              <input type="password" placeholder="Enter current password" />
            </div>
            <div className="formGroup">
              <label>New Password</label>
              <input type="password" placeholder="Enter new password" />
            </div>
            <div className="formGroup">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm new password" />
            </div>
            <button className="btn btnPrimary fullWidth marginTop15">Update Password</button>
          </div>

          <div className="card">
            <h3>Notification Preferences</h3>

            <h4 className="settingsSectionTitle">Email & SMS Notifications</h4>
            <div className="my-15">
              <label className="checkboxLabel">
                <input type="checkbox" checked />
                <span className="checkboxBox"></span>
                <span>Email notifications for shift reminders</span>
              </label>
              <label className="checkboxLabel">
                <input type="checkbox" checked />
                <span className="checkboxBox"></span>
                <span>SMS notifications for urgent updates</span>
              </label>
              <label className="checkboxLabel">
                <input type="checkbox" />
                <span className="checkboxBox"></span>
                <span>Daily digest of activities</span>
              </label>
            </div>

            <h4 className="settingsSectionTitle">Notification Frequency</h4>
            <div className="my-15">
              <label className="radioLabel">
                <input type="radio" name="frequency" value="immediate" checked />
                <span className="radioBox"></span>
                <span>Immediate notifications</span>
              </label>
              <label className="radioLabel">
                <input type="radio" name="frequency" value="daily" />
                <span className="radioBox"></span>
                <span>Daily summary</span>
              </label>
              <label className="radioLabel">
                <input type="radio" name="frequency" value="weekly" />
                <span className="radioBox"></span>
                <span>Weekly summary</span>
              </label>
            </div>

            <button className="btn btnPrimary fullWidth marginTop15">Save Preferences</button>
          </div>

          <div className="card">
            <h3>Specialty Management</h3>
            <div className="formGroup">
              <label>Add New Specialty</label>
              <div className="inputGroup">
                <input type="text" placeholder="Enter specialty name" />
                <button className="btn btnPrimary">Add</button>
              </div>
            </div>
            <div className="specialtyList">
              <h4 className="settingsSectionTitle">Current Specialties:</h4>
              <div className="scrollableList">
                <div className="listItem">
                  <span className="listItemName">Family Medicine</span>
                  <button className="btnRemove">Remove</button>
                </div>
                <div className="listItem">
                  <span className="listItemName">Internal Medicine</span>
                  <button className="btnRemove">Remove</button>
                </div>
                <div className="listItem">
                  <span className="listItemName">Pediatrics</span>
                  <button className="btnRemove">Remove</button>
                </div>
                <div className="listItem">
                  <span className="listItemName">Cardiology</span>
                  <button className="btnRemove">Remove</button>
                </div>
                <div className="listItem">
                  <span className="listItemName">Emergency Medicine</span>
                  <button className="btnRemove">Remove</button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Volunteer Type Management</h3>
            <div className="formGroup">
              <label>Add New Volunteer Type</label>
              <div className="inputGroup">
                <input type="text" placeholder="Enter volunteer type" />
                <button className="btn btnPrimary">Add</button>
              </div>
            </div>
            <div className="volunteerTypeList">
              <h4 className="settingsSectionTitle">Current Volunteer Types:</h4>
              <div className="scrollableList">
                <div className="listItem">
                  <span className="listItemName">Registration/Check-in</span>
                  <button className="btnRemove">Remove</button>
                </div>
                <div className="listItem">
                  <span className="listItemName">Medical Assistant</span>
                  <button className="btnRemove">Remove</button>
                </div>
                <div className="listItem">
                  <span className="listItemName">Pharmacy Assistant</span>
                  <button className="btnRemove">Remove</button>
                </div>
                <div className="listItem">
                  <span className="listItemName">Interpreter/Translator</span>
                  <button className="btnRemove">Remove</button>
                </div>
                <div className="listItem">
                  <span className="listItemName">General Support</span>
                  <button className="btnRemove">Remove</button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Shift Settings</h3>
            <div className="formGroup">
              <label>Per Day Shift Hours</label>
              <input type="number" placeholder="Enter shift hours" value="4" min="1" max="24" />
            </div>
            <button className="btn btnPrimary fullWidth marginTop15">Save Shift Settings</button>
          </div>
        </div>
      </div>

      {/* <!-- Organization Settings Screen --> */}
      <div id="org-settings" className="screen">
        <div className="header">
          <h2>Organization Settings <span className="orgBadge" id="orgSettingsBadge">Mercy Free Clinic</span></h2>
          <button className="btn btnLogout" onclick="switchScreen('login')">Logout</button>
        </div>

        <div className="dashboardGrid">
          <div className="card">
            <h3>Organization Profile</h3>
            <div className="formGroup">
              <label>Organization Name</label>
              <input type="text" value="Mercy Free Clinic" placeholder="Enter organization name" />
            </div>
            <div className="formGroup">
              <label>Address</label>
              <input type="text" value="123 Main St, Anytown, ST 12345" placeholder="Enter address" />
            </div>
            <div className="formGroup">
              <label>Phone</label>
              <input type="tel" value="(555) 123-4567" placeholder="Enter phone" />
            </div>
            <div className="formGroup">
              <label>Brand Color</label>
              <div className="flexRow15">
                <input type="color" id="orgColorSettings" value="#667eea" onchange="updateColorPreview('orgColorSettings', 'orgColorSettingsPreview')" />
                <div className="flexColumn">
                  <div id="orgColorSettingsPreview" className="colorPreview"></div>
                  <span id="orgColorSettingsValue" className="colorValue">#667eea</span>
                </div>
              </div>
            </div>
            <button className="btn btnPrimary fullWidth marginTop15">Save Organization Profile</button>
          </div>

          <div className="card">
            <h3>User Management</h3>
            <div className="formGroup">
              <label>Invite User Email</label>
              <input type="email" placeholder="Enter user email" />
            </div>
            <div className="formGroup">
              <label>Role</label>
              <select>
                <option value="org-admin">Organization Admin</option>
                <option value="provider">Provider</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
            <button className="btn btnPrimary fullWidth marginTop15">Send Invitation</button>
          </div>

          <div className="card">
            <h3>Clinic Configuration</h3>
            <div className="my-15">
              <label className="checkboxLabel">
                <input type="checkbox" checked />
                Enable weekend clinics
              </label>
              <label className="checkboxLabel">
                <input type="checkbox" />
                Enable multi-day events
              </label>
              <label className="checkboxLabel">
                <input type="checkbox" checked />
                Automatic reminder notifications
              </label>
            </div>
            <button className="btn btnPrimary fullWidth marginTop15">Save Configuration</button>
          </div>
        </div>
      </div>

      {/* <!-- Volunteer Reports Screen --> */}
      <div id="volunteer-reports" className="screen">
        <div className="header">
          <h2>Volunteer Reports</h2>
          <button className="btn btnLogout" onclick="switchScreen('login')">Logout</button>
        </div>

        <div className="card mb-3fullWidth">
          <h3>Search Volunteers</h3>

          {/* <!-- Volunteer Search --> */}
          <div className="mb-2fullWidth">
            <label className="block mb-1fullWidth">Volunteer Name</label>
            <div className="searchWrapper">
              <div className="searchInputContainer">
                <input type="text" id="report-volunteer-search" placeholder="Search volunteer..." className="searchInput" />
                <div id="report-volunteer-dropdown" className="searchDropdown"></div>
              </div>
              <button type="button" className="dropdownToggleBtn" onclick="toggleReportVolunteers()" title="Show all volunteers">▼</button>
            </div>
            <div className="mt-1fullWidth">
              <span id="selected-volunteer-name" className="font-semibold text-primary">No volunteer selected</span>
            </div>
          </div>

          {/* <!-- Date Range Filter --> */}
          <div className="flex gap-20 mt-2fullWidth">
            <div className="flex-1">
              <label className="block mb-1fullWidth">Start Date</label>
              <input type="date" id="report-start-date" className="searchInput" />
            </div>
            <div className="flex-1">
              <label className="block mb-1fullWidth">End Date</label>
              <input type="date" id="report-end-date" className="searchInput" />
            </div>
            <div className="flex items-end">
              <button className="btn btnPrimary m-fullWidth" onclick="generateVolunteerReport()">Generate Report</button>
            </div>
          </div>
        </div>

        {/* <!-- Summary Section --> */}
        <div className="dashboardGrid mb-3fullWidth">
          <div className="card">
            <h3>Summary</h3>
            <div className="cardStat">
              <span className="cardStatLabel">Total Days Worked</span>
              <span className="cardStatValue" id="total-days-worked">0</span>
            </div>
            <div className="cardStat">
              <span className="cardStatLabel">Total Hours</span>
              <span className="cardStatValue" id="total-hours-worked">0</span>
            </div>
          </div>
        </div>

        {/* <!-- Results Table --> */}
        <div className="tableContainer">
          <div className="tableScroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Clinic</th>
                  <th>Role</th>
                  <th>Hours Worked</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="volunteer-report-results">
                <tr>
                  <td colspan="5" className="text-center p-3fullWidth text-secondary">Select a volunteer and date range to view report</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}