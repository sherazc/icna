export default function Dashboard() {
  return (
    <div id="dashboard" className="screen active">
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
  );
}