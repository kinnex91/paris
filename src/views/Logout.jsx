import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import '../css/style.css';
import { useTranslation } from 'react-i18next';
import i18n from '../js/i118n.js'; // Importer l'instance i18n
import axios from 'axios';

//THIS MENU IS DEPRECATED WE USE T
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Logout() {

    const navigate = useNavigate();

    useEffect(() => {
        const doLogOut = async () => {
            try {
                var rest = null;
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `${API_BASE_URL}/auth/logout`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                // déconnecter
                localStorage.setItem('jwt', null);
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } catch (error) {
                console.error('Erreur de déconnexion:', error);
            }
        }
        doLogOut();
    });
}

export default Logout;