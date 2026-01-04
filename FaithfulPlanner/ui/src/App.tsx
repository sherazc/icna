import {BrowserRouter} from "react-router-dom";

import './App.css'
import AppRoutes from "./routes/AppRoutes";
import { AppProvider } from "./store/context";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
