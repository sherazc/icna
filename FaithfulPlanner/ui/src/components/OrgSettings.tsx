export default function OrgSettings() {
  return (
    <div id="org-settings">
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
  );
}