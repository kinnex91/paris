import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/admin.css';


const RequestAdminAndNotAdmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState(''); // Définir le state du toast
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    // Fonction pour afficher le toast
    const showToast = (message) => {
        setToastMessage(message);
        toast.error(message);
    };


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


    useEffect(() => {
        document.body.classList.add('no-background');
        document.body.classList.add('background-pirate');
        // Supprimer la classe quand on quitte la page
        return () => {
            document.body.classList.remove('no-background');
            document.body.classList.remove('background-pirate');
        };
    }, []);

    useEffect(() => {
        const checkIfAdmin = async () => {
            try {
                const jwt = localStorage.getItem('jwt');
                if (!jwt || jwt === 'null') {
                    showToast('Vous devez être connecté pour accéder à cette page');
                    //navigate('/login');
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
            <div className="admin-page">
                {isLoggedIn ? (
                    <>
                        {isAdmin ? (
                            <div className="admin-panel">
                                <h2>Bienvenue, Administrateur</h2>
                                <p>Vous avez accès aux fonctionnalités d'administration.</p>
                            </div>
                        ) : (
                            <div className="user-panel">
                                <h2>Bienvenue, Utilisateur</h2>
                                <p>Vous êtes connecté en tant qu'utilisateur standard.</p>
                            </div>
                        )}
                    </>)
                    : (<>
                    <div className="user-panel">
                                <h2>Accès non autorisé</h2>
                                <p>Vous devez être connecté en admin pour accéder à cette fonction.  </p>
                            </div>
                    
                    </>)}
            </div>
        </>
    );
};

export default RequestAdminAndNotAdmin;
