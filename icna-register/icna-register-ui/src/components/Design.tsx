import React, {CSSProperties} from "react";
import formStyles from "./FormStyles.module.scss";

interface Props {
}

const getVars = () => {
    return {
        "--primary-color": "blue"
    } as CSSProperties
}

export const Design: React.FC<Props> = () => {
    return (
        <div>
            <div>
                <input className={formStyles.testClass}/>
            </div>
        </div>
    );
}