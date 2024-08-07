import * as React from "react"

interface Props {
    height?: string;
    width?: string;
    fill?: string;
}

export const IconArrowRight: React.FC<Props> = ({ height = "100px", width = "100px", fill = "#000" }) => {
    return (
        <svg
            style={{width, height, fill}}
            viewBox="0 0 100 100">
            <path d="M37.34 99.381l37.224-49.585L36.877.618 25.435 10.744l30.009 39.158-29.639 39.481z"/>
        </svg>
    )
}
