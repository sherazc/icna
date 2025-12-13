export default function OrgManagement() {
  return (
    <div id="org-management">
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
  );
}