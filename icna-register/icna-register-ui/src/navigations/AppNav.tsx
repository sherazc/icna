import {Link, useParams} from "react-router-dom";
import React from "react";

export default function AppNav() {
    const {eventId} = useParams();
    return (
        <nav>
            <ul>
                <li>
                    <Link to={`/event/${eventId}`}>Home</Link>
                </li>
                <li>
                    <Link to={`/event/${eventId}/register/new`}>Register</Link>
                </li>
                <li>
                    <Link to={`/event/${eventId}/attendees`}>Attendee List</Link>
                </li>
            </ul>
        </nav>
    );
}
