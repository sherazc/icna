import { clinicApis as createClinicApis } from "../service/api/ApiClinic";

export default function Login() {

  const handleGetCompanies = async () => {
    const clinicApis = createClinicApis();
    const companies = await clinicApis.getAllCompanies();
    console.log("Fetched companies:", companies);
  }

  return (
      <div id="login">
        <div className="loginContainer">
          <h1>FaithfulPlanner</h1>
          <form data-onsubmit="handleLogin(event)">
            <div className="formGroup">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div className="formGroup">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" required />
            </div>
            <div className="formGroup">
              <label htmlFor="organization">Organization</label>
              <select id="organization" required>
                <option value="">Select your organization</option>
                <option value="mercy-clinic">Mercy Free Clinic</option>
                <option value="hope-center">Hope Community Center</option>
                <option value="faith-health">Faith & Health Alliance</option>
              </select>
            </div>
            <div className="formGroup">
              <label htmlFor="role">Role</label>
              <select id="role" required>
                <option value="">Select your role</option>
                <option value="super-admin">Super Admin</option>
                <option value="org-admin">Organization Admin</option>
                <option value="provider">Provider/Doctor</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
            <div className="formActions">
              <button type="submit" className="btn btnPrimary" onClick={handleGetCompanies}>Get Companies</button>
              <button type="submit" className="btn btnPrimary">Login</button>
              <button type="button" className="btn btnSecondary" data-onclick="switchScreen('org-registration')">Register Organization</button>
            </div>
          </form>
        </div>
      </div>
  );
}