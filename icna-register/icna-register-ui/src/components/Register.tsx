import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {registerApis} from "../service/api/ApiRegister";
import {AttendeeDto, defaultAttendeeDto} from "../service/service-types";

interface Props {
}

export const Register: React.FC<Props> = () => {
    const {eventId, registrationId} = useParams();
    const [attendees, setAttendees] = useState<AttendeeDto[]>([]);

    useEffect(() => {
        if (!eventId || !registrationId) {
            return;
        }
        const apiCalls = async () => {
            if (registrationId === 'new') {
                setAttendees([defaultAttendeeDto()]);
                return;
            }

            let regApis = registerApis();
            const attendeeDtoArray: AttendeeDto[] = await regApis.findAttendeeByEventIdAndRegistrationId(eventId, registrationId);
            setAttendees(attendeeDtoArray)
        };

        apiCalls();

    }, [eventId, registrationId]);


    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Submitting", new Date());
    }

    return (
        <div>
            <div>Register</div>
            <form action="#" onSubmit={onSubmit}>

                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
};