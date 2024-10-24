import React, {useContext} from "react";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {AppContext} from "../store/context";

export const ManageEvent = () => {
    const {eventId} = useParams();
    const navigate = useNavigate();
    const [{authUserToken}, dispatch] = useContext(AppContext);
    const cancelLink = eventId ? `/event/${eventId}` : "/";
    const authenticated = authUserToken.userProfileId > 0;
    const adminUser = authUserToken.roles.includes("ADMIN");

    if (authenticated && !adminUser) {
        return <Navigate to={`/event/${eventId}`} />
    }

    return (
        <div>
            <h1>Event</h1>
            {adminUser ?  "I am admin." : "I am not admin."}
            {authenticated ?  "I am authenticated." : "I am not authenticated."}
            <div>
                <button onClick={() => navigate(cancelLink)}>Cancel</button>
            </div>
        </div>
    );
}