export default function Settings() {
  return (
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
  );
}