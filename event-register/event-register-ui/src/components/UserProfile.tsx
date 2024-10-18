import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {defaultRegistrationDto, defaultUserProfileDto, RegistrationDto, UserProfileDto} from "../service/service-types";

interface Props {
}

/*

Call API to Load User profile in this page. API will take event ID and User Profile ID

API - Get registration by userProfileId

If this user is admin show manage Event component

If this user is Assistant show manage Attendee component

secure all APIs. Use auth token in UI to make API calls

*/

export const UserProfile: React.FC<Props> = () => {
    const {userProfileId} = useParams();
    const [userProfileDto, setUserProfileDto] = useState<UserProfileDto>(defaultUserProfileDto())
    const [registrationDto, setRegistrationDto] = useState<RegistrationDto>(defaultRegistrationDto())

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
