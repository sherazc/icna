export default function ShiftDetails() {
  return (
    <div id="shift-details">
      <div className="header">
        <h2>Shift Details</h2>
        <button className="btn btnLogout" data-onclick="switchScreen('login')">Logout</button>
      </div>

      <div className="cardsGrid">
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
  );
}