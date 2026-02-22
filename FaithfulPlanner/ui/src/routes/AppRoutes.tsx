import { Route, Routes } from "react-router-dom";
import Layout01 from "../layouts/Layout01";
import Login from "../components/auth/Login";
import Dashboard from "../components/Dashboard";
import CompanyRegistration from "../components/CompanyRegistration";
import OrgSelection from "../components/OrgSelection";
import OrgManagement from "../components/OrgManagement";
import Schedules from "../components/Schedules";
import ShiftDetails from "../components/ShiftDetails";
import Notifications from "../components/Notifications";
import Settings from "../components/Settings/Settings";
import VolunteerReports from "../components/VolunteerReports";
import { EmployeeGroup } from "../components/EmployeeGroup";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout01/>}>
        <Route index element={<Login/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="dashboard" element={<Dashboard/>}/>
        <Route path="/employee-group/:employeeGroupId" element={<EmployeeGroup/>}/>
        <Route path="company-registration" element={<CompanyRegistration/>}/>
        <Route path="org-selection" element={<OrgSelection/>}/>
        <Route path="org-management" element={<OrgManagement/>}/>
        <Route path="schedules" element={<Schedules/>}/>
        <Route path="shift-details" element={<ShiftDetails/>}/>
        <Route path="notifications" element={<Notifications/>}/>
        <Route path="settings" element={<Settings/>}/>
        <Route path="volunteer-reports" element={<VolunteerReports/>}/>
      </Route>
    </Routes>
  );
}