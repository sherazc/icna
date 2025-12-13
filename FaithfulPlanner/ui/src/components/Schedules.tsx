export default function Schedules() {
  return (
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
  );
}