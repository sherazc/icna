import { useContext, useEffect, useState } from "react";
import { defaultLoginRequest, FormState, type LoginRequest } from "../../service/service-types";
import { AppContext } from "../../store/context";
import { ActionNameAuthUser } from "../../store/authUserReducer";
import { useNavigate } from "react-router-dom";
import { ErrorForm } from "../common/ErrorForm";
import { Loading } from "../common/Loading";
import { ActionNameClinicApis } from "../../store/clinicApisReducer";
import { createAuthHeader, clinicApis as clinicApisFunction } from "../../service/api/ApiClinic";
import { ActionNameCompanySlugName } from "../../store/companySlugNameReducer";
import "./Login.css";
import { prefixCompanySlugNameUrl } from "../../service/navigation-service";

export default function Login() {
  const navigate = useNavigate();
  const [{ companies, clinicApis, companySlugName, loginSuccessRedirectUrl }, dispatch] = useContext(AppContext);
  const [loginRequest, setLoginRequest] = useState<LoginRequest>(defaultLoginRequest());
  const [formState, setFormState] = useState<FormState>(FormState.FRESH);
  const containsCompanySlugName = companySlugName.id && companySlugName.id > 0;

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setLoginRequest(prevData => ({ ...prevData, [id]: value }));
  };

  const login = async () => {
    setFormState(FormState.IN_PROGRESS);
    try {
      if (containsCompanySlugName && companySlugName.id) {
        loginRequest.companyId = "" + companySlugName.id
      }
      const authUserTokenDto = await clinicApis.login(loginRequest);
      const companySlugNameResponse = await clinicApis.getCompanyById(authUserTokenDto.companyId);
      dispatch({
        type: ActionNameCompanySlugName.companySlugNameUrlSet,
        payload: companySlugNameResponse
      });
      dispatch({
        type: ActionNameAuthUser.authUserLogin,
        payload: authUserTokenDto
      });
      dispatch({
        type: ActionNameClinicApis.updateClinicApis,
        payload: clinicApisFunction(createAuthHeader(authUserTokenDto)) // TODO: in the error interceptor, detect if it is unauth. Navigate to /
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

  const onLoginDifferentOrg = () => {
    dispatch({type: ActionNameCompanySlugName.companySlugNameUrlRemove});
    navigate("/login");
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login();
  }

  useEffect(() => {
    if (formState === FormState.SUCCESSFUL && companySlugName.slugName) {
      console.log("get loginSuccessRedirectUrl", loginSuccessRedirectUrl);
      if (loginSuccessRedirectUrl.length > 0) {
        navigate(loginSuccessRedirectUrl);
      } else {
        navigate(prefixCompanySlugNameUrl(companySlugName, "/dashboard"));
      }
    };
  }, [formState, navigate, companySlugName, loginSuccessRedirectUrl]);

  return (
    <div id="login">
      <div className="slimContainer">
        <h1>{containsCompanySlugName ? companySlugName.companyName : "Faithful Planner"}</h1>
        <ErrorForm formState={formState} defaultError="Login failed. Please check your credentials and try again" />
        <Loading formState={formState} />
        <form onSubmit={handleSubmit}>
          {!containsCompanySlugName && (
            <div className="formGroup">
              <label htmlFor="companyId">Organization</label>
              <select id="companyId" onChange={onChangeSelect} required>
                <option value="">Select your organization</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>{company.companyName}</option>
                ))}
              </select>
            </div>
          )}

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
            {!containsCompanySlugName && (
              <button type="button" className="btn btnSecondary" onClick={() => navigate("/company-registration")}>
                Register Organization
              </button>
            )}
          </div>

          {containsCompanySlugName && (
            <div>
              <span className="linkButton" onClick={onLoginDifferentOrg}>← Login to different organization</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}