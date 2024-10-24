import React from "react";
import {useNavigate, useParams} from "react-router-dom";

export const ManageEvent = () => {
    const navigate = useNavigate();
    const {eventId} = useParams();
    const cancelLink = eventId ? `/event/${eventId}` : "/";

    return (
        <div>
            <h1>Event</h1>
            <div>
                <button onClick={() => navigate(cancelLink)}>Cancel</button>
            </div>
        </div>
    );
}