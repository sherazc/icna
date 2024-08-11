import * as React from "react"
import {Icon} from "./Icon";

interface Props {
    height?: string;
    width?: string;
    fill?: string;
}

export const IconArrowRight: React.FC<Props> = (
    {
        height,
        width,
        fill
    }) => {
    return (
        <Icon
            height={height}
            width={width}
            fill={fill}
            pathD="M37.34 99.381l37.224-49.585L36.877.618 25.435 10.744l30.009 39.158-29.639 39.481z"
        />
    );
};
