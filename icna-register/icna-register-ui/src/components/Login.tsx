import React, {useContext, useState} from "react";
import styles from "./Login.module.scss";
import {IconArrowRight} from "../images/IconArrowRight";
import {useParams} from "react-router-dom";
import {IconArrowLeft} from "../images/IconArrowLeft";
import {registerApis} from "../service/api/ApiRegister";
import {AuthUserTokenDto, defaultLoginRequest, LoginRequest} from "../service/service-types";
import {AppContext} from "../store/context";
import {ActionNameAuthUser} from "../store/authUserReducer";
import {isNotBlankString} from "../service/utilities";
import {isValidAuthUserToken} from "../service/common-services";

interface Props {
}

enum LoginState {
    SHOW_EMAIL, SHOW_PASSWORD, LOADING,
    SHOW_OTU_CODE, LOGIN_SUCCESS, LOGIN_FAILURE
}

export const Login: React.FC<Props> = () => {

    const [ {authUserToken}, dispatch ] = useContext(AppContext);

    const {eventId} = useParams();

    const [loginRequest, setLoginRequest] = useState<LoginRequest>(defaultLoginRequest(eventId));

    const [loginState, setLoginState] = useState<LoginState>(LoginState.SHOW_EMAIL);

    const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setLoginRequest(prevData => ({ ...prevData, [id]: value }));
    };

    const onSubmitLogin = () => {
        registerApis().login(loginRequest).then(aut => {
            console.log(aut);
            dispatch({
                type: ActionNameAuthUser.authUserLogin,
                payload: aut
            });
            setLoginState(LoginState.LOGIN_SUCCESS);
        }).catch(error => {
            console.log(error);
            setLoginState(LoginState.LOGIN_FAILURE);
        });
    }

    if (isValidAuthUserToken(authUserToken)) {
        return <></>;
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

                {(loginState === LoginState.SHOW_PASSWORD
                    ||  loginState === LoginState.SHOW_OTU_CODE
                    || loginState === LoginState.LOGIN_FAILURE) && (<>
                    <div style={{marginTop: "20px", display: "flex", alignItems: "center"}}>
                        <div style={{flexGrow: 1}}>
                            <a href="#" onClick={() => {
                                setLoginRequest(defaultLoginRequest(eventId));
                                setLoginState(LoginState.SHOW_EMAIL);
                            }}>
                                <IconArrowLeft/> Back
                            </a>
                        </div>
                        {loginState !== LoginState.LOGIN_FAILURE && (
                        <div style={{flexGrow: 1, textAlign: "right"}}>
                            <input type="button" value="Submit" onClick={onSubmitLogin}/>
                        </div>
                        )}
                        {loginState === LoginState.LOGIN_FAILURE && (
                            <div style={{flexGrow: 1, textAlign: "right"}}>
                                Failed to login.
                            </div>
                        )}
                    </div>
                </>)}
            </div>
        </div>
    );
}
