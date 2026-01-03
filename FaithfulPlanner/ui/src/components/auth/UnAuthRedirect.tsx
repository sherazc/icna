import {type FC, useContext} from 'react';
import {Navigate, useParams} from "react-router-dom";
import {AppContext} from "../../store/context";
import {isBlankString} from "../../service/utilities";

export const UnAuthRedirect: FC = () => {
    const {eventId} = useParams();
    const [{authUserToken}] = useContext(AppContext);
    let redirect = isBlankString(eventId);
    let redirectUrl = "/";
    const authenticated:boolean = authUserToken.userProfileId > 0;

    if (!redirect && !authenticated) {
        redirect = true;
        redirectUrl = `/event/${eventId}`
    }

    return (
        <>
            {redirect && <Navigate to={redirectUrl} /> }
        </>
    );
};