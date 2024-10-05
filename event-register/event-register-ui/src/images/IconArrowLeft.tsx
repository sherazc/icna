import * as React from "react"
import {Icon} from "./Icon";

interface Props {
    height?: string;
    width?: string;
    fill?: string;
}

export const IconArrowLeft: React.FC<Props> = (
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
            pathD="M 62.659729,99.381456 25.435515,49.796655 63.122647,0.6185441 74.564485,10.744275 44.555628,49.902191 74.194863,89.383358 Z"
        />
    );
};
