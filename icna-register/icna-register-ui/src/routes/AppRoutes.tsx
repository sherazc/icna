import {Route, Routes} from "react-router-dom";
import React from "react";
import AppLayout from "../layouts/AppLayout";
import {Home} from "../components/Home";
import {Register} from "../components/Register";
import {UserList} from "../components/UserList";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout/>}>
                <Route index element={<Home/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/users-list" element={<UserList/>}/>
            </Route>
        </Routes>
    );
}
