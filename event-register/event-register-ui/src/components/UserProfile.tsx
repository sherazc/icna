import React, {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {defaultRegistrationDto, defaultUserProfileDto, RegistrationDto, UserProfileDto} from "../service/service-types";
import {AppContext} from "../store/context";
import {registerApis} from "../service/api/ApiRegister";
import {UnAuthRedirect} from "./auth/UnAuthRedirect";
import {createLoadingActionHide, createLoadingActionShow} from "./Loading";

interface Props {
}

/*
Logout

API - Get registration by userProfileId

If this user is admin show manage Event component

If this user is Assistant show manage Attendee component

secure all APIs. Use auth token in UI to make API calls

*/

export const UserProfile: React.FC<Props> = () => {
    const [{authUserToken}, dispatch] = useContext(AppContext);
    const {eventId} = useParams();
    const [userProfileDto, setUserProfileDto] = useState<UserProfileDto>(defaultUserProfileDto())
    const [registrationDto, setRegistrationDto] = useState<RegistrationDto>(defaultRegistrationDto())
    const regApis = registerApis();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, [eventId, authUserToken]);

    const loadData = async () => {
        if (authUserToken.userProfileId < 1) {
            return;
        }
        const loading = createLoadingActionShow("Loading user profile");
        dispatch(loading);

        setUserProfileDto(await regApis.getUserProfile("" + authUserToken.userProfileId));

        try {
            setRegistrationDto(await regApis.findRegistrationByUserProfileId("" + authUserToken.userProfileId));
        } catch (error) {
            console.log(`userProfileId = ${authUserToken.userProfileId}, do not have any registration. ${error}`);
        }

        dispatch(createLoadingActionHide(loading.payload.id));
    }

    return (
        <div>
            <UnAuthRedirect/>
            <div>
                <h1>My Profile</h1>
            </div>
            <div>
                <button>Logout</button>
            </div>
            <div>
                Email: {userProfileDto.email}
            </div>
        </div>
    );
}
