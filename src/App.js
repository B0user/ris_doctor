// Modules
import { Routes, Route } from "react-router-dom";
// Layouts
import Layout from "./components/Layouts/Layout";
import PersistLogin from "./components/Layouts/PersistLogin";
// Login
// import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import LoginRedirection from "./features/auth/LoginRedirection";
import RequireAuth from "./components/Layouts/RequireAuth";
// import LoginRedir from "./features/auth/LoginRedir";



import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";

import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";


///
import Dashboard from "./pages/Dashboard";
import Worklist from "./pages/Worklist";
import PanelLayout from "./components/Layouts/PanelLayout";
import StudyReport from "./pages/StudyReport";
import Register from "./features/auth/Register";

import 'react-toastify/dist/ReactToastify.css';
import { newTheme } from "./theme";

function App() {
  const [theme, colorMode] = useMode();
  const defaultTheme = createTheme();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={newTheme}>
        <CssBaseline />

        <Routes>
          <Route path="/" element={<Layout />}>
            {/* change to redir later */}
            <Route index element={<LoginRedirection />} /> 
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Register />} />

            
            <Route element={<PanelLayout/>}>
              
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="worklist" element={<Worklist />} />
              <Route path="worklist/:id" element={<StudyReport/>}/>
            </Route>


            <Route path="unauthorized" element={<Unauthorized />} />
            <Route element={<PersistLogin />}>
              {/* <Route path="/redir" element={<LoginRedir />} /> */}
              <Route element={<RequireAuth/>}>

                
              </Route>

              

              
            </Route>
            <Route path="*" element={<Missing />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
