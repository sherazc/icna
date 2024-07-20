import {Route, Routes} from "react-router-dom";
import React from "react";
import AppLayout from "../layouts/AppLayout";
import {Home} from "../components/Home";
import {Register} from "../components/Register";
import {AttendeeList} from "../components/AttendeeList";
import {AttendeeInfo} from "../components/AttendeeInfo";
import {Design} from "../components/Design";
import {StyleVariables} from "../components/StyleVariables";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/design/:eventId" element={<StyleVariables><Design/></StyleVariables>}/>
            <Route path="/event/:eventId" element={<StyleVariables><AppLayout/></StyleVariables>}>
                <Route index element={<Home/>}/>
                <Route path="register/:registrationId" element={<Register/>}/>
                <Route path="attendees" element={<AttendeeList/>}/>
                <Route path="attendees/:attendeeId" element={<AttendeeInfo/>}/>
            </Route>
        </Routes>
    );
}
