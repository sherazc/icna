import { useContext, useEffect, useState } from "react";
import { defaultLoginRequest, FormState, type LoginRequest } from "../../service/service-types";
import { AppContext } from "../../store/context";
import { ActionNameAuthUser } from "../../store/authUserReducer";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [{ companies, clinicApis }, dispatch] = useContext(AppContext);

  const [loginRequest, setLoginRequest] = useState<LoginRequest>(defaultLoginRequest());
  const [formState, setFormState] = useState<FormState>(FormState.FRESH);

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setLoginRequest(prevData => ({ ...prevData, [id]: value }));
  };

  const login = async () => {
    setFormState(FormState.IN_PROGRESS);
    try {
      const authUserTokenDto = await clinicApis.login(loginRequest);
      dispatch({
        type: ActionNameAuthUser.authUserLogin,
        payload: authUserTokenDto
      });
      setFormState(FormState.SUCCESSFUL);
    } catch (error) {
      console.error("Login failed:", error);
      setFormState(FormState.FAILED);
    }
  }

  const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = event.target;
    setLoginRequest(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login();
  }

  useEffect(() => {
    if (formState === FormState.SUCCESSFUL) navigate("/dashboard");
  }, [formState, navigate]);

  return (
    <div id="login">
      <div className="slimContainer">
        <h1>FaithfulPlanner</h1>
        {formState === FormState.FAILED && (
          <div className="errorMessage">Login failed. Please check your credentials and try again</div>
        )}
        {formState === FormState.IN_PROGRESS && (
          <div className="text-left">Logging in, please wait...</div>
        )}
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
            <button type="submit" className="btn btnPrimary" disabled={formState === FormState.IN_PROGRESS}>Login</button>
            <button type="button" className="btn btnSecondary" onClick={() => navigate("/company-registration")}>Register Organization</button>
          </div>
        </form>
      </div>
    </div>
  );
}