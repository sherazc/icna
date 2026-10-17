import "./ScreenFooterMain.css"
import React from "react";

interface Props { }

export const ScreenFooterMain: React.FC<Props> = () => {
  return (
    <footer className="screenFooterMain">© {new Date().getFullYear()} Faithful Planner</footer>
  );
};
