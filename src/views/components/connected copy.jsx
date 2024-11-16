import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/admin.css';
import { FaUserShield, FaUser } from 'react-icons/fa';

const ConnectedHome = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const checkIfAdmin = async () => {
            try {
                const jwt = localStorage.getItem('jwt');
                if (!jwt || jwt === 'null') {
                    toast.error('Vous devez être connecté pour accéder à cette page');
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${BACKEND_URL}/auth/is-admin`, {
                    headers: { Authorization: `Bearer ${jwt}` }
                });

                setIsAdmin(response.data.isAdmin);
                setIsLoading(false);
            } catch (error) {
                console.error('Erreur lors de la vérification de l\'administrateur', error);
                toast.error('Erreur lors de la vérification. Veuillez réessayer.');
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
                {isAdmin ? (
                    <div className="admin-panel">
                        <FaUserShield className="icon" />
                        <h2>Bienvenue, Administrateur</h2>
                        <p>Vous avez accès aux fonctionnalités d'administration.</p>
                        <ul>
                            <li><a href="/admin/manage-users">Gérer les utilisateurs</a></li>
                            <li><a href="/admin/manage-ligue">Gérer les ligues</a></li>
                            <li><a href="/admin/manage-team">Gérer les équipes</a></li>
                            <li><a href="/admin/manage-tournament">Gérer les tournois</a></li>
                            <li><a href="/admin/manage-results">Gérer les résultats</a></li>
                        </ul>
                    </div>
                ) : (
                    <div className="user-panel">
                        <FaUser className="icon" />
                        <h2>Bienvenue, Utilisateur</h2>
                        <p>Vous êtes connecté en tant qu'utilisateur standard.</p>
                        <button onClick={() => navigate('/profile')}>Voir mon profil</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default ConnectedHome;
