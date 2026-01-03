import { useContext, useEffect, useState } from "react";
import { defaultLoginRequest, type LoginRequest } from "../service/service-types";
import { AppContext } from "../store/context";

export default function Login() {
  const [{ companies }] = useContext(AppContext);

  const [loginRequest, setLoginRequest] = useState<LoginRequest>(defaultLoginRequest());

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setLoginRequest(prevData => ({ ...prevData, [id]: value }));
  };

  return (
    <div id="login">
      <div className="loginContainer">
        <h1>FaithfulPlanner</h1>
        <form data-onsubmit="handleLogin(event)">
          <div className="formGroup">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your email" required 
            onChange={onChangeText} />
          </div>
          <div className="formGroup">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required 
            onChange={onChangeText} />
          </div>
          <div className="formGroup">
            <label htmlFor="organization">Organization</label>
            <select id="organization" required>
              <option value="">Select your organization</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>{company.companyName}</option>
              ))}
            </select>
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