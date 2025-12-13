export default function Volunteers() {
  return (
    <div id="volunteers">
      <div className="header">
        <h2>Volunteer Management <span className="orgBadge" id="volunteerOrgBadge">Mercy Free Clinic</span></h2>
        <div className="headerActions">
          <button className="btn btnSecondary" data-onclick="switchScreen('org-selection')">Switch Organization</button>
          <button className="btn btnPrimary" data-onclick="openModal('addVolunteerModal')">+ Add Volunteer</button>
          <button className="btn btnLogout" data-onclick="switchScreen('login')">Logout</button>
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
  );
}