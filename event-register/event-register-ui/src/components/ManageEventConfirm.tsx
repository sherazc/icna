import React, {useContext, useEffect} from "react";
import {NavLink, useParams} from "react-router-dom";
import {AppContext} from "../store/context";

export const ManageEventConfirm = () => {

    const {eventId} = useParams();
    const [{regApis}] = useContext(AppContext);

    const loadData = async () => {
        if (!eventId) {
            return;
        }


    }

    useEffect(() => {
        loadData();
    }, [eventId]);

    return (
        <div>
            <h1>Event Saved</h1>
            <div><NavLink to={"/login"}>Login to edit</NavLink></div>
        </div>
    );
}