import {Route, Routes, useParams} from "react-router-dom";
import React from "react";
import AppLayout from "../layouts/AppLayout";
import {Home} from "../components/Home";
import {Register} from "../components/Register";
import {UserList} from "../components/UserList";

export default function AppRoutes() {
    const {eventId} = useParams();

    return (
        <Routes>
            <Route path="/event/:eventId" element={<AppLayout/>}>
                <Route index element={<Home eventId={eventId ? eventId : ""}/>}/>
                <Route path="register" element={<Register eventId={eventId as string} />}/>
                <Route path="users-list" element={<UserList eventId={eventId as string}/>}/>
            </Route>
        </Routes>
    );
}
