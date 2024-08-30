import React from "react";
import styles from "./Login.module.scss";
import {IconArrowRight} from "../images/IconArrowRight";

interface Props {
}

export const Login: React.FC<Props> = () => {
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <div style={{marginBottom: "20px"}}>
                    <label htmlFor="">Login</label>
                </div>
                <input placeholder="Email" style={{width: "290px"}}/>
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
