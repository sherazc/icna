import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {defaultUserProfileDto, UserProfileDto} from "../service/service-types";
import {AppContext} from "../store/context";
import {registerApis} from "../service/api/ApiRegister";
import {UnAuthRedirect} from "./auth/UnAuthRedirect";
import {createLoadingActionHide, createLoadingActionShow} from "./Loading";
import {ActionNameAuthUser} from "../store/authUserReducer";
import {IconArrowRight} from "../images/IconArrowRight";

interface Props {
}

export const UserProfile: React.FC<Props> = () => {
    const [{authUserToken}, dispatch] = useContext(AppContext);
    const {eventId} = useParams();
    const [userProfileDto, setUserProfileDto] = useState<UserProfileDto>(defaultUserProfileDto())

    const regApis = registerApis();

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

        dispatch(createLoadingActionHide(loading.payload.id));
    }

    const onLogout = () => {
        dispatch({type: ActionNameAuthUser.authUserLogout})
    }

    return (
        <div>
            <UnAuthRedirect/>
            <div>
                <h1>My Profile</h1>
            </div>
            <div>
                <button onClick={onLogout}>Logout</button>
            </div>
            <div>
                Email: {userProfileDto.email}
            </div>
            {authUserToken.registrationId > 0 && (
                <div>
                    <Link to={`/event/${eventId}/register/${authUserToken.registrationId}`}>Edit Register <IconArrowRight/></Link>
                </div>
            )}
        </div>
    );
}
