import React, { useEffect,useState } from 'react';
import {Route, Routes} from 'react-router-dom';

//--> on mettra dans chaque page le css, ici au pire juste le minimul legal le body class --> 
import './css/style.css'; 

import Menu from './views/Menu.jsx';

import LoginPage from './views/LoginPage.jsx';
import RegisterPage from './views/RegisterPage.jsx';
import AboutPage from './views/About.jsx';
import VerifyEmailPage from './views/VerifyEmailPage.jsx';
import Metrics from './views/Metrics.jsx';
import Translate from './views/Translate.jsx';
import Logout from './views/Logout.jsx';
import Logged from './views/Logged.jsx';



// justify-content: center;
function App() {




    return (
        <>
            
         
      
                <Translate/>


                <Routes>

                    <Route path="/menu" element={<Menu />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<RegisterPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/verifyEmail" element={<VerifyEmailPage />} />
                    <Route path="/metrics" element={<Metrics />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/logged" element={<Logged />} />
                    {/* Routes protégées */}
                   
                </Routes>
          
        </>
    );
}

export default App;
