import { Route, Routes } from "react-router-dom";
import Layout01 from "../layouts/Layout01";
import Home from "../components/Home";
import Login from "../components/Login";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/clinic/:clinicId" element={<Layout01/>}>
        <Route index element={<Home/>}/>
        <Route path="login" element={<Login/>}/>

      </Route>

    </Routes>
  );
}