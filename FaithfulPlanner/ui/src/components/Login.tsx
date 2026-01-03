import { useContext, useState } from "react";
import { defaultLoginRequest, type LoginRequest } from "../service/service-types";
import { AppContext } from "../store/context";

export default function Login() {
  const [{ companies, clinicApis }] = useContext(AppContext);

  const [loginRequest, setLoginRequest] = useState<LoginRequest>(defaultLoginRequest());

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setLoginRequest(prevData => ({ ...prevData, [id]: value }));
  };

  const login = async () => {
    const authUserTokenDto = await clinicApis.login(loginRequest);
    console.log("Logged in user token:", authUserTokenDto);
  }

  const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = event.target;
    setLoginRequest(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login();
  }

  return (
    <div id="login">
      <div className="loginContainer">
        <h1>FaithfulPlanner</h1>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="companyId">Organization</label>
            <select id="companyId" onChange={onChangeSelect} required>
              <option value="">Select your organization</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>{company.companyName}</option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your email" required 
            onChange={onChangeText} />
          </div>
          <div className="formGroup">
            <label htmlFor="userPassword">Password</label>
            <input type="password" id="userPassword" placeholder="Enter your password" required 
            onChange={onChangeText} />
          </div>
          
          <div className="formActions">
            <button type="submit" className="btn btnPrimary">Login</button>
            <button type="button" className="btn btnSecondary" data-onclick="switchScreen('org-registration')">Register Organization</button>
          </div>
        </form>
      </div>
    </div>
  );
}