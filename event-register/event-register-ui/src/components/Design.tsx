import React, {useContext} from "react";
import "../styles/Global.module.scss";
import checkRadio from "../styles/CheckRadio.module.scss"
import {AppContext} from "../store/context";
import {ActionNameLoading} from "../store/loadingMessageReducer";
import {ActionNameAuthUser} from "../store/authUserReducer";
import {defaultAuthUserTokenDto} from "../service/service-types";

interface Props {
}

export const Design: React.FC<Props> = () => {
    const [ state, dispatch ] = useContext(AppContext);


    const addLoading = () => {
        dispatch({
            type: ActionNameLoading.loadingShow,
            payload: {
                message: "yes",
                id: 100
            }
        });
    }

    const loginUser = () => {
        dispatch({
            type: ActionNameAuthUser.authUserLogin,
            payload: {...defaultAuthUserTokenDto(), subject: "sheraz@icna.org"}
        });
    }

    const logoutUser = () => {
        dispatch({
            type: ActionNameAuthUser.authUserLogout
        });
    }

    return (
        <div style={{margin: "20px"}}>

            <button onClick={addLoading}>
                Add Loading
            </button>

            <button onClick={loginUser}>
                Login
            </button>

            <button onClick={logoutUser}>
                Logout
            </button>

            <hr/>
            {state.loadingMessages.map((lm, index) => <div key={index}>{lm.message}</div>)}
            <hr/>

            <hr/>
            {state.authUserToken.subject}
            <hr/>


            <div>Some Text in div</div>
            <div>
                <p>
                    Some Text paragraph
                </p>
            </div>
            <div>
                <pre className="code">
                    // Pre code text
                    <br/>
                    select * from DUAL;
                </pre>
            </div>
            <div>
                <h1>H1 Text</h1>
            </div>
            <div>
                <h2>H2 Text</h2>
            </div>
            <div>
                <h3>H3 Text</h3>
            </div>
            <div>
                <h4>H4 Text</h4>
            </div>

            <div>
                This is an <a href="#">anchor</a> tag.
            </div>

            <div style={{margin: "10px"}}>
                <input type="button" value="Click me"/>
            </div>
            <div style={{margin: "10px"}}>
                <label className={checkRadio.checkContainer}>One Check
                    <input type="checkbox"/>
                    <span className={checkRadio.checkbox}></span>
                </label>
                <label className={checkRadio.checkContainer}>Two Check
                    <input type="checkbox" checked/>
                    <span className={checkRadio.checkbox}></span>
                </label>
            </div>
            <div style={{margin: "10px"}}>
                <label className={checkRadio.radioContainer}>One Radio
                    <input type="radio" checked name="radio"/>
                    <span className={checkRadio.radio}></span>
                </label>
                <label className={checkRadio.radioContainer}>Two Radio
                    <input type="radio" name="radio"/>
                    <span className={checkRadio.radio}></span>
                </label>
            </div>
            <div style={{margin: "10px"}}>
                <label htmlFor="inputText">Input Text</label>
                <input id="inputText" type="text" placeholder="input text"/>
            </div>
            <div style={{margin: "10px"}}>
                <label htmlFor="inputDate">Input Date</label>
                <input id="inputDate" type="date"/>
            </div>
            <div style={{margin: "10px"}}>
                <label htmlFor="inputDateTimeLocal">Input Date Time Local</label>
                <input id="inputDateTimeLocal" type="datetime-local"/>
            </div>
            <div style={{margin: "10px"}}>
                <label htmlFor="textArea">Text Area</label>
                <br/>
                <textarea id="textArea" cols={30} rows={10}>
                </textarea>
            </div>
        </div>
    );
}