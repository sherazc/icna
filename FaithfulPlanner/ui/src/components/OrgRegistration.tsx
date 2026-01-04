export default function OrgRegistration () {
  return (
          <div id="company-registration">
        <div className="loginContainer">
          <h1>Register Organization</h1>
          <form data-onsubmit="handleOrgRegistration(event)">
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
                <input type="color" id="orgColor" value="#667eea" data-onchange="updateColorPreview('orgColor', 'orgColorPreview')" />
                <div className="flexColumn">
                  <div id="orgColorPreview" className="colorPreview"></div>
                  <span id="orgColorValue" className="colorValue">#667eea</span>
                </div>
              </div>
            </div>
            <div className="formActions">
              <button type="submit" className="btn btnPrimary">Register Organization</button>
              <button type="button" className="btn btnSecondary" data-onclick="switchScreen('login')">Back to Login</button>
            </div>
          </form>
        </div>
      </div>
  );
}