import {Route, Routes} from "react-router-dom";
import React from "react";
import AppLayout from "../layouts/AppLayout";
import {Home} from "../components/Home";
import {Register} from "../components/Register";
import {AttendeeList} from "../components/AttendeeList";
import {AttendeeInfo} from "../components/AttendeeInfo";
import {Design} from "../components/Design";
import {StyleVar} from "../components/StyleVar";
import {PrintBadge} from "../components/PrintBadge";
import {RegisterConfirmation} from "../components/RegisterConfirmation";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/design/:eventId" element={<StyleVar><Design/></StyleVar>}/>
            <Route path="/event/:eventId" element={<StyleVar><AppLayout/></StyleVar>}>
                <Route index element={<Home/>}/>
                <Route path="register/:registrationId" element={<Register/>}/>
                <Route path="register-confirmation/:registrationId" element={<RegisterConfirmation/>}/>
                <Route path="attendees" element={<AttendeeList/>}/>
                <Route path="attendees/:attendeeId" element={<AttendeeInfo/>}/>
            </Route>
            <Route path="/event/:eventId/print/register/:registrationId" element={<StyleVar><PrintBadge/></StyleVar>}></Route>
            <Route path="/event/:eventId/print/attendees/:attendeeId" element={<StyleVar><PrintBadge/></StyleVar>}></Route>
        </Routes>
    );
}
