import React, {useEffect} from "react";
import {useParams} from "react-router-dom";

interface Props {
}

export const Register: React.FC<Props> = () => {

    const {eventId, registrationId} = useParams();

    useEffect(() => {
        if (!eventId) {
            return;
        }

    }, []);
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