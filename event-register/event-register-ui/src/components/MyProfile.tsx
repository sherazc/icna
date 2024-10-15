import React, {useEffect} from "react";
import {useParams} from "react-router-dom";

interface Props {
}

export const MyProfile: React.FC<Props> = () => {
    const {registrationId} = useParams();

    useEffect(() => {
    }, [registrationId])

    return (
        <div>
            <div>
                <h1>My Profile</h1>
            </div>
        </div>
    );
}
