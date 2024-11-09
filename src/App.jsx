import React from 'react';
import {Route, Routes} from 'react-router-dom';

//--> on mettra dans chaque page le css, ici au pire juste le minimul legal le body class --> 
import './css/style.css'; 

import Menu from './views/Menu.jsx';

import LoginPage from './views/LoginPage.jsx';
import RegisterPage from './views/RegisterPage.jsx';
import AboutPage from './views/About.jsx';
// justify-content: center;
function App() {

    return (
        <>
            
         
      
                <Menu/>

              

                <Routes>

                    <Route path="/menu" element={<Menu />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<RegisterPage />} />
                    <Route path="/about" element={<AboutPage />} />

                    {/* Routes protégées */}
                   
                </Routes>
          
        </>
    );
}

export default App;
