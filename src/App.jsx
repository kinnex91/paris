import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import LoggedInRoute from './views/components/LoggedInRoute.jsx';
import AdminRoute from './views/components/AdminRoute.jsx';
import RequestAdminAndNotAdmin from './views/requestAdminAndNotAdmin.jsx'
import RequestLoggedInAndNotLoggedIn from './views/RequestLoggedInAndNotLoggedIn.jsx'

//--> on mettra dans chaque page le css, ici au pire juste le minimul legal le body class --> 
import './css/style.css';

import Home from './views/Home.jsx';
import Menu from './views/Menu.jsx';

import LoginPage from './views/LoginPage.jsx';
import RegisterPage from './views/RegisterPage.jsx';
import AboutPage from './views/About.jsx';
import VerifyEmailPage from './views/VerifyEmailPage.jsx';
import Metrics from './views/Metrics.jsx';
import Translate from './views/Translate.jsx';
import Logout from './views/Logout.jsx';
import Logged from './views/Logged.jsx';
import NotFound from './views/NotFound.jsx';
import { toast, ToastContainer } from 'react-toastify';


import TournamentDataGrid from './views/admin/grid/TournamentDataGrid.jsx';

// justify-content: center;
function App() {


    const [toastMessage, setToastMessage] = useState('');

    // Déclare `isLoggedIn` avec `useState`
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedLoggedIn = localStorage.getItem('loggedIn');
        return storedLoggedIn === 'true'; // Convertir en booléen
    });

    // Fonction pour mettre à jour l'état `isLoggedIn` lorsque l'utilisateur se connecte ou se déconnecte
    const checkIfLoggedIn = () => {
        const jwt = localStorage.getItem('jwt');
        setIsLoggedIn(jwt && jwt !== 'null');
    };

    useEffect(() => {
        checkIfLoggedIn();
    }, []);


    return (
        <>



            <Translate />


            <Routes>
                {/* Route publique */}
                <Route path="/" element={<Home />} />
                <Route path="/requestAdminAndNotAdmin" element={<RequestAdminAndNotAdmin />} />
                <Route path="/requestLoggedInAndNotLoggedIn" element={<RequestLoggedInAndNotLoggedIn />} />

                
                <Route path="/menu" element={<Menu />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/verifyEmail" element={<VerifyEmailPage />} />

                <Route path="/logout" element={<Logout />} />
                <Route path="/logged" element={<Logged />} />
                {/* Routes protégées */}
                <Route element={<LoggedInRoute isLoggedIn={isLoggedIn} />}>
                    <Route path="/metrics" element={<Metrics />} />
                </Route>

                {/* Routes inconnues */}
                <Route path="*" element={<NotFound />} />

                  {/* Routes CRUD ADMIIN */}
                  <Route path="/admin/tournament" element={<TournamentDataGrid />} />
            </Routes>

        </>
    );
}

export default App;
