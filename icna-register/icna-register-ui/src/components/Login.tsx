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

enum LoginState {
    SHOW_EMAIL, SHOW_PASSWORD, LOADING, SHOW_SUBMIT,
    SHOW_OTU_CODE, LOGIN_SUCCESS, LOGIN_FAILURE
}

export const Login: React.FC<Props> = () => {

    const {eventId} = useParams();

    const [loginRequest, setLoginRequest] = useState<LoginRequest>({
        email: "", eventId: touchString(eventId)
    });

    const [loginState, setLoginState] = useState<LoginState>(LoginState.SHOW_EMAIL);

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

                {loginState === LoginState.SHOW_EMAIL && (<input
                    id="email"
                    value={loginRequest.email}
                    onChange={onChangeText}
                    placeholder="Email"
                    style={{width: "290px"}}/>)}

                {loginState === LoginState.SHOW_PASSWORD && (<input
                    id="userPassword"
                    value={loginRequest.userPassword}
                    onChange={onChangeText}
                    placeholder="Enter Password"
                    style={{width: "290px"}}/>)}

                {loginState === LoginState.SHOW_EMAIL && (<>
                    <a onClick={() => setLoginState(LoginState.SHOW_PASSWORD)}
                       style={{justifyContent: "right", marginTop: "20px"}} href="#">
                        Login with password <IconArrowRight/>
                    </a>
                    <a style={{justifyContent: "right", marginTop: "20px"}} href="#">
                        Login email code <IconArrowRight/>
                    </a>
                </>)}

            </div>
        </div>
    );
}
