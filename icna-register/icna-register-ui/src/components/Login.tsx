import React, {useState} from "react";
import styles from "./Login.module.scss";
import {IconArrowRight} from "../images/IconArrowRight";
import {useParams} from "react-router-dom";
import {IconArrowLeft} from "../images/IconArrowLeft";
import {registerApis} from "../service/api/ApiRegister";
import {defaultLoginRequest, LoginRequest} from "../service/service-types";

interface Props {
}

enum LoginState {
    SHOW_EMAIL, SHOW_PASSWORD, LOADING, SHOW_SUBMIT,
    SHOW_OTU_CODE, LOGIN_SUCCESS, LOGIN_FAILURE
}

export const Login: React.FC<Props> = () => {

    const {eventId} = useParams();

    const [loginRequest, setLoginRequest] = useState<LoginRequest>(defaultLoginRequest(eventId));

    const [loginState, setLoginState] = useState<LoginState>(LoginState.SHOW_EMAIL);

    const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setLoginRequest(prevData => ({ ...prevData, [id]: value }));
    };

    const onSubmitLogin = () => {
        registerApis().login(loginRequest).then(a => console.log(a))
            .catch(e => console.log(e));
    }

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

                {loginState === LoginState.SHOW_OTU_CODE && (<input
                    id="oneTimeUseCode"
                    value={loginRequest.oneTimeUseCode}
                    onChange={onChangeText}
                    placeholder="One Time Use Code"
                    style={{width: "290px"}}/>)}


                {loginState === LoginState.SHOW_EMAIL && (<>
                    <a onClick={() => setLoginState(LoginState.SHOW_PASSWORD)}
                       style={{justifyContent: "right", marginTop: "20px"}} href="#">
                        Login with password <IconArrowRight/>
                    </a>
                    <a onClick={() => setLoginState(LoginState.SHOW_OTU_CODE)}
                        style={{justifyContent: "right", marginTop: "20px"}} href="#">
                        Login email code <IconArrowRight/>
                    </a>
                </>)}

                {(loginState === LoginState.SHOW_PASSWORD ||  loginState === LoginState.SHOW_OTU_CODE) && (<>
                    <div style={{marginTop: "20px", display: "flex", alignItems: "center"}}>
                        <div style={{flexGrow: 1}}>
                            <a href="#" onClick={() => {
                                setLoginRequest(defaultLoginRequest(eventId));
                                setLoginState(LoginState.SHOW_EMAIL);
                            }}>
                                <IconArrowLeft/> Cancel
                            </a>
                        </div>
                        <div style={{flexGrow: 1, textAlign: "right"}}>
                            <input type="button" value="Submit" onClick={onSubmitLogin}/>
                        </div>
                    </div>
                </>)}
            </div>
        </div>
    );
}
