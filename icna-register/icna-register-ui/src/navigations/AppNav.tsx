import {Link} from "react-router-dom";
import React from "react";

export default function AppNav() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                <li>
                    <Link to="/users-list">User List</Link>
                </li>
            </ul>
        </nav>
    );
}
