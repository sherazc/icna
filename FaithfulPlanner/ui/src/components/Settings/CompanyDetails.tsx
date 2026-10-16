import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/context";
import { FormState, type CompanyDto, type ErrorDto } from "../../service/service-types";
import { ErrorField } from "../common/ErrorField";
import { Loading } from "../common/Loading";
import { ErrorForm } from "../common/ErrorForm";
import { toScErrorResponses, validateCompanyDetailsForm } from "../../service/errors-helpers";
import { ActionNameCompanySlugName } from "../../store/companySlugNameReducer";

const THEME_OPTIONS = [
  { id: 1, name: "Light" },
  { id: 2, name: "Dark" },
];

export const CompanyDetails = () => {
  const [{ clinicApis, companySlugName }, dispatch] = useContext(AppContext);
  const [company, setCompany] = useState<CompanyDto | undefined>();
  const [formErrors, setFormErrors] = useState<ErrorDto[]>([]);
  const [formState, setFormState] = useState<FormState>(FormState.FRESH);

  const onChangeTheme = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setCompany(prev => prev && ({ ...prev, uiThemeId: value ? Number(value) : undefined }));
    setFormState(FormState.FRESH);
  };

  useEffect(() => {
    setCompany(companySlugName);
  }, [companySlugName]);

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setCompany(prev => prev && ({ ...prev, [id]: value }));
    setFormState(FormState.FRESH);
  };

  const handleSubmit = async () => {
    if (!company) return;
    setFormErrors([]);
    const errors: ErrorDto[] = validateCompanyDetailsForm(company);

    if (errors.length < 1) {
      setFormState(FormState.IN_PROGRESS);
      try {
        const saved = await clinicApis.updateCompany(company);
        dispatch({
          type: ActionNameCompanySlugName.companySlugNameUrlSet,
          payload: saved
        });
        setFormState(FormState.SUCCESSFUL);
      } catch (error) {
        errors.push(...toScErrorResponses(error));
        errors.push({ message: "Failed to update company details" });
        setFormState(FormState.FAILED);
      }
    } else {
      setFormState(FormState.FAILED);
    }
    setFormErrors(errors);
  };

  return (
    <div className="card">
      <h3>Company Details</h3>
      <ErrorForm formState={formState} errors={formErrors} />
      <Loading formState={formState} />
      {company &&
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="formGroup">
            <label htmlFor="companyName">Organization Name</label>
            <input id="companyName" type="text"
              onChange={onChangeText}
              value={company.companyName}
            />
            <ErrorField errors={formErrors} fieldName="company.companyName" />
          </div>
          <div className="formGroup">
            <label htmlFor="uiThemeId">Theme</label>
            <select id="uiThemeId" value={company.uiThemeId ?? ""} onChange={onChangeTheme}>
              <option value="">Default</option>
              {THEME_OPTIONS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <ErrorField errors={formErrors} fieldName="uiThemeId" />
          </div>
          <div>
            <button type="submit" className="btn btnPrimary fullWidth marginTop15">Save</button>
          </div>
        </form>
      }
    </div>
  )
}
