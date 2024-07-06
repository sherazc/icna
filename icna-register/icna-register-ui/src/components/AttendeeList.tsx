import React from "react";
import {useParams} from "react-router-dom";

interface Props {
}

export const AttendeeList: React.FC<Props> = () => {
    const {eventId} = useParams();

    return <>UserList {eventId} sdfs</>
}