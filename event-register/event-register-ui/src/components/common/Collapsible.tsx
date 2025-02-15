import React, {useRef} from "react";
import styles from "./Collapsible.module.scss";

interface Props {
    children: React.ReactNode;
    open: boolean;
}

export const Collapsible: React.FC<Props> = ({children, open}) => {
    const contentRef = useRef<HTMLDivElement | null>(null);
    return (
        <div className={styles.container}>
            <div ref={contentRef} className={styles.collapsibleContent}
                style={{
                    maxHeight: open && contentRef.current ? `${contentRef.current.scrollHeight}px` : "0",
                    opacity: open ? 1 : 0
                }}>
                <div className={styles.contentBox}>{children}</div>
            </div>
        </div>
    );
};