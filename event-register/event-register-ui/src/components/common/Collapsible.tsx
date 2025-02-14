import React, {useRef, useState} from "react";
import styles from "./Collapsible.module.scss";

interface Props {
    children: React.ReactNode;
}

export const Collapsible: React.FC<Props> = ({children}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement | null>(null);

    return (
        <div className={styles.container}>
            <button onClick={() => setIsOpen(!isOpen)} className={styles.collapsibleBtn}>
                {isOpen ? "Collapse" : "Expand"}
            </button>

            <div
                ref={contentRef}
                className={styles.collapsibleContent}
                style={{
                    maxHeight: isOpen && contentRef.current ? `${contentRef.current.scrollHeight}px` : "0",
                    opacity: isOpen ? 1 : 0}}>
                <div className={styles.contentBox}>
                    <p>This is the collapsible content.</p>
                    <p>You can add more information here.</p>
                </div>
            </div>
        </div>
    );
};