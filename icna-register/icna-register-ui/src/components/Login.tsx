import React, {useState} from "react";
import styles from "./Login.module.scss";
import {IconArrowRight} from "../images/IconArrowRight";
import {useParams} from "react-router-dom";
import {touchString} from "../service/utilities";

interface Props {
}

type LoginRequest = {
    eventId: string,
    email: string,
    userPassword?: string
    oneTimeUseCode?: string;
}

export const Login: React.FC<Props> = () => {

    const {eventId} = useParams();

    const [loginRequest, setLoginRequest] = useState<LoginRequest>({
        email: "", eventId: touchString(eventId)
    });

    const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setLoginRequest(prevData => ({ ...prevData, [id]: value }));
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <div style={{marginBottom: "20px"}}>
                    <label htmlFor="">Login</label>
                </div>
                <input
                    id="email"
                    value={loginRequest.email}
                    onChange={onChangeText}
                    placeholder="Email"
                    style={{width: "290px"}}/>
                <a style={{justifyContent: "right", marginTop: "20px"}} href="#">
                    Login with password <IconArrowRight/>
                </a>
                <a style={{justifyContent: "right", marginTop: "20px"}} href="#">
                    Login email code <IconArrowRight/>
                </a>
            </div>
        </div>
    );
}
