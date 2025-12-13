import {BrowserRouter} from "react-router-dom";

import '../public/scripts/main.css'
import './App.css'
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  )
}

export default App
