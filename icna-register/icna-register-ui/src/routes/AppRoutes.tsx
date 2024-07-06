import {Route, Routes} from "react-router-dom";
import React from "react";
import AppLayout from "../layouts/AppLayout";
import {Home} from "../components/Home";
import {Register} from "../components/Register";
import {AttendeeList} from "../components/AttendeeList";
import {AttendeeInfo} from "../components/AttendeeInfo";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/event/:eventId" element={<AppLayout/>}>
                <Route index element={<Home/>}/>
                <Route path="register" element={<Register/>}/>
                <Route path="attendees" element={<AttendeeList/>}/>
                <Route path="attendees/:attendeeId" element={<AttendeeInfo/>}/>
            </Route>
        </Routes>
    );
}
