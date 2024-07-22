import React from "react";
import "../styles/Global.module.scss";
import checkRadio from "../styles/CheckRadio.module.scss"

interface Props {
}

export const Design: React.FC<Props> = () => {
    return (
        <div style={{margin: "20px"}}>
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