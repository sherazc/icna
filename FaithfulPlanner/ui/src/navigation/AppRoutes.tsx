import { Route, Routes } from "react-router-dom";
import Layout01 from "../layouts/Layout01";
import Login from "../components/auth/Login";
import Dashboard from "../components/dashboard/Dashboard";
import CompanyRegistration from "../components/CompanyRegistration";
import OrgSelection from "../components/OrgSelection";
import OrgManagement from "../components/OrgManagement";
import Schedules from "../components/Schedules";
import ShiftDetails from "../components/ShiftDetails";
import Notifications from "../components/Notifications";
import Settings from "../components/Settings/Settings";
import VolunteerReports from "../components/VolunteerReports";
import { EmployeeGroup } from "../components/EmployeeGroup";
import { Index } from "../components/Index";
import { CompanyHome } from "../components/CompanyHome";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout01/>}>
        {/* Unauthenticated views */}
        <Route index element={<Index/>}/>
        <Route path="/company-registration" element={<CompanyRegistration/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path=":companySlugNameUrl/login" element={<Login/>}/>
        

        {/* Not used pages. Copy paste template pages from UI design */}
        <Route path="/org-selection" element={<OrgSelection/>}/>
        <Route path="/org-management" element={<OrgManagement/>}/>
        <Route path="/shift-details" element={<ShiftDetails/>}/>
        <Route path="/schedules" element={<Schedules/>}/>
        <Route path="/notifications" element={<Notifications/>}/>
        <Route path="/volunteer-reports" element={<VolunteerReports/>}/>


        {/* Authenticated views */}
        <Route path=":companySlugNameUrl/dashboard" element={<Dashboard/>}/>
        <Route path=":companySlugNameUrl/employee-group/:employeeGroupId" element={<EmployeeGroup/>}/>
        <Route path=":companySlugNameUrl/settings" element={<Settings/>}/>
        <Route path=":companySlugNameUrl" element={<CompanyHome/>}/>

      </Route>
    </Routes>
  );
}