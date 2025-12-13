export default function Notifications() {
  return (
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
  );
}