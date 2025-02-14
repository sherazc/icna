import {Route, Routes} from "react-router-dom";
import React from "react";
import EventLayout from "../layouts/EventLayout";
import {Home} from "../components/Home";
import {Register} from "../components/Register";
import {AttendeeList} from "../components/AttendeeList";
import {AttendeeInfo} from "../components/AttendeeInfo";
import {Design} from "../components/Design";
import {StyleVar} from "../components/StyleVar";
import {PrintBadge} from "../components/PrintBadge";
import {RegisterConfirmation} from "../components/RegisterConfirmation";
import {UserProfile} from "../components/UserProfile";
import {MainHome} from "../components/MainHome";
import AppLayout from "../layouts/AppLayout";
import {ManageEvent} from "../components/ManageEvent";
import {ManageEventConfirm} from "../components/ManageEventConfirm";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<StyleVar><AppLayout/></StyleVar>}>
                <Route index element={<MainHome/>}/>
                <Route path="create-event" element={<ManageEvent/>}/>
            </Route>

            <Route path="/event/:eventId" element={<StyleVar><EventLayout/></StyleVar>}>
                <Route index element={<Home/>}/>
                <Route path="manage" element={<ManageEvent/>}/>
                <Route path="register/:registrationId" element={<Register/>}/>
                <Route path="register-confirmation/:registrationId" element={<RegisterConfirmation/>}/>
                <Route path="attendees" element={<AttendeeList/>}/>
                <Route path="attendees/:attendeeId" element={<AttendeeInfo/>}/>
                <Route path="user-profile" element={<UserProfile/>}/>
                <Route path="manage-event-confirm" element={<ManageEventConfirm/>}/>
            </Route>
            <Route path="/design/:eventId" element={<StyleVar><Design/></StyleVar>}/>
            <Route path="/event/:eventId/print/register/:registrationId" element={<StyleVar><PrintBadge/></StyleVar>}></Route>
            <Route path="/event/:eventId/print/attendees/:attendeeId" element={<StyleVar><PrintBadge/></StyleVar>}></Route>
        </Routes>
    );
}
