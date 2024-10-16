import React, {useEffect} from "react";
import {useParams} from "react-router-dom";

interface Props {
}

/*

secure all APIs. Use auth token in UI to make API calls

Call API to Load User profile in this page. API will take event ID and User Profile ID

API - Get registration by userProfileId

If this user is admin show manage Event component

If this user is Assistant show manage Attendee component

*/

export const MyProfile: React.FC<Props> = () => {
    const {userProfileId} = useParams();

    useEffect(() => {
    }, [userProfileId])

    return (
        <div>
            <div>
                <h1>My Profile</h1>
            </div>
        </div>
    );
}
