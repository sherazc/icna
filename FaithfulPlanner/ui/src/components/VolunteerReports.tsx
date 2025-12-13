export default function VolunteerReports() {
  return (
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
  );
}