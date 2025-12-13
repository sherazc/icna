import { Route, Routes } from "react-router-dom";
import Layout01 from "../layouts/Layout01";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/clinic/:clinicId" element={<Layout01/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="login" element={<Login/>}/>

      </Route>

    </Routes>
  );
}