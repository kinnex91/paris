import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/admin.css';

const RequestAdminAndNotAdmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState('');
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [countdown, setCountdown] = useState(10); // Compteur pour la redirection
    const NEW_URL = 'https://www.betforfun.devforever.ovh';

    // Fonction pour afficher le toast
    const showToast = (message) => {
        setToastMessage(message);
        toast.error(message);
    };

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedLoggedIn = localStorage.getItem('loggedIn');
        return storedLoggedIn === 'true';
    });

    const checkIfLoggedIn = () => {
        const jwt = localStorage.getItem('jwt');
        setIsLoggedIn(jwt && jwt !== 'null');
    };

    useEffect(() => {
        checkIfLoggedIn();
    }, []);

    useEffect(() => {

        document.body.classList.add('background-pirate');
        return () => {
      
            document.body.classList.remove('background-pirate');
        };
    }, []);

    useEffect(() => {
        const checkIfAdmin = async () => {
            try {
                const jwt = localStorage.getItem('jwt');
                if (!jwt || jwt === 'null') {
                    showToast('Vous devez être connecté pour accéder à cette page');
                    setIsLoading(false);
                    return;
                }

                const response = await axios.get(`${BACKEND_URL}/auth/is-admin`, {
                    headers: { Authorization: `Bearer ${jwt}` }
                });

                setIsAdmin(response.data.isAdmin);
                setIsLoading(false);
            } catch (error) {
                console.error('Erreur lors de la vérification de l\'administrateur', error);
                showToast('Erreur lors de la vérification. Veuillez réessayer.');
                navigate('/login');
            }
        };

        checkIfAdmin();
    }, [navigate, BACKEND_URL]);

    // Texte défilant, toast et redirection
    useEffect(() => {
        showToast(`Changement d'adresse : ${NEW_URL}`);

        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            window.location.href = NEW_URL;
        }, 10000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Chargement en cours...</p>
            </div>
        );
    }

    return (
        <>
            <ToastContainer />
            <div className="marquee-container">
                <marquee className="marquee-text">
                    Changement d'adresse : le nouveau site est{' '}
                    <a href={NEW_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'yellow' }}>
                        {NEW_URL}
                    </a>
                </marquee>
            </div>
            <div className="countdown-message">
                Redirection dans {countdown} secondes...
            </div>
            <div className="admin-page">
                {isLoggedIn ? (
                    isAdmin ? (
                        <div className="admin-panel">
                            <h2>Bienvenue, Administrateur</h2>
                            <p>Vous avez accès aux fonctionnalités d'administration.</p>
                        </div>
                    ) : (
                        <div className="user-panel">
                            <h2>Bienvenue, Utilisateur</h2>
                            <p>Vous êtes connecté en tant qu'utilisateur standard.</p>
                        </div>
                    )
                ) : (
                    <div className="user-panel">
                        <h2>Accès non autorisé</h2>
                        <p>Vous devez être connecté en admin pour accéder à cette fonction.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default RequestAdminAndNotAdmin;
