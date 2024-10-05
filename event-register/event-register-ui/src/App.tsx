import React from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import {AppProvider} from "./store/context";


export default function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <AppRoutes/>
            </BrowserRouter>
        </AppProvider>
    );
}
