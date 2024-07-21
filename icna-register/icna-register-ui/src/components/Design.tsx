import React, {CSSProperties} from "react";
import "./FormStyles.module.scss";

interface Props {
}

const getVars = () => {
    return {
        "--primary-color": "blue"
    } as CSSProperties
}

export const Design: React.FC<Props> = () => {
    return (
        <div style={{margin: "20px"}}>
            <div style={{margin: "10px"}}>
                <input type="button" value="Click me"/>
            </div>
            <div style={{margin: "10px"}}>
                <label htmlFor="inputCheckbox">Input checkbox</label>
                <input id="inputCheckbox" type="checkbox"/>
            </div>
            <div style={{margin: "10px"}}>
                <label htmlFor="inputRadio1">Input Radio 1</label>
                <input id="inputRadio1" type="radio" name="inputRadio"/>
                <label htmlFor="inputRadio2">Input Radio 2</label>
                <input id="inputRadio2" type="radio" name="inputRadio"/>
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
                <label htmlFor="inputDateTimeLocal">Input Date Time Local</label>
                <br/>
                <textarea name="" id="" cols={30} rows={10}>
                </textarea>
            </div>
        </div>
    );
}