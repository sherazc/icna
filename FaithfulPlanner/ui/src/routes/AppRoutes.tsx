import { Route, Routes } from "react-router-dom";
import Layout01 from "../layouts/Layout01";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout01/>}>


      </Route>

    </Routes>
  );
}