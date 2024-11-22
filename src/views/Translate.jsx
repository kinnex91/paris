import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Select from 'react-select';
import ClipLoader from 'react-spinners/ClipLoader';
import '../css/style.css';
import '../css/loader.css';
import '../css/menu.css';
import { useLocation, useNavigate } from 'react-router-dom';

function Translate() {
    const { i18n } = useTranslation();
    const [actualLang, setActualLang] = useState(() => localStorage.getItem('selectedLang') || 'fr');
    /*const [languages, setLanguages] = useState(() => {
        const storedLanguages = localStorage.getItem('languages');
        return storedLanguages ? storedLanguages : [];
    });*/
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(() => JSON.parse(localStorage.getItem('loggedIn')) || false);

    const location = useLocation();

    const LIBRETRANSLATE_SERVER = import.meta.env.VITE_LIBRETRANSLATE_SERVER;
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // Vérifier si l'utilisateur est connecté
    const checkIfLoggedIn = async () => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt || jwt === 'null') {
            setIsLoggedIn(false);
            localStorage.setItem('loggedIn', false);
            return;
        }

        try {
            const response = await axios.get(`${BACKEND_URL}/auth/is-logged-in`, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            setIsLoggedIn(response.data.isLoggedIn);
            localStorage.setItem('loggedIn', JSON.stringify(response.data.isLoggedIn));

        } catch (error) {
            console.error('Erreur lors de la vérification de la connexion', error);
            setIsLoggedIn(false);
            localStorage.setItem('loggedIn', JSON.stringify(false));
        }
    };

    // Vérifier si l'utilisateur est un admin
    const checkIfAdmin = async () => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt || jwt === 'null') {
            setIsAdmin(false);
            return;
        }

        try {
            const response = await axios.get(`${BACKEND_URL}/auth/is-admin`, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            setIsAdmin(response.data.isAdmin);
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'administrateur', error);
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        const path = location.pathname;
        if (path === '/logged' || path === '/logout') {

            checkIfLoggedIn();
            checkIfAdmin();

        }

        fetchLanguages();

        if (actualLang != 'fr')
            translatePage(actualLang);

    }, [location]); // Rafraîchir chaque fois que la route change

    // Récupérer la liste des langues depuis l'API
    const fetchLanguages = async () => {
        try {
            const response = await axios.get(`${LIBRETRANSLATE_SERVER}/languages`);
            const languageOptions = response.data.map((lang) => ({
                value: lang.code,
                label: `${lang.name} (${lang.code.toUpperCase()})`
            }));
            setLanguages(languageOptions);
            localStorage.setItem('languages', languageOptions);

        } catch (error) {
            console.error('Erreur lors de la récupération des langues:', error);
        }
    };

    // Changer la langue
    const changeLanguage = (selectedOption) => {
        const lang = selectedOption.value;
        setActualLang(lang);
        i18n.changeLanguage(lang);
        localStorage.setItem('selectedLang', lang);
        translatePage(lang);
    };

    const translatePage = async (targetLang) => {
        setLoading(true);
        if (document.readyState === 'complete') {
            const elements = document.body;
            await translateNode(elements, targetLang);
        }
        setLoading(false);
    };

    const translateNode = async (node, targetLang) => {
        if (
            node.nodeType === Node.ELEMENT_NODE &&
            (node.classList.contains('doNotTraduct') ||
                node.tagName.toUpperCase() === 'SCRIPT' ||
                node.tagName.toUpperCase() === 'NOSCRIPT')
        ) {
            return;
        }

        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const translatedText = await translateText(node.textContent, targetLang);
            node.textContent = translatedText;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const childNode of node.childNodes) {
                await translateNode(childNode, targetLang);
            }
        }
    };

    const translateText = async (text, targetLang) => {
        try {
            const response = await axios.post(`${LIBRETRANSLATE_SERVER}/translate`, {
                q: text,
                source: 'auto',
                target: targetLang,
                format: 'text'
            });
            return response.data.translatedText;
        } catch (error) {
            console.error('Erreur lors de la traduction:', error);
            return text;
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('jwt');

        try {

            setIsLoggedIn(false);
            localStorage.setItem('loggedIn', JSON.stringify(false));
            localStorage.removeItem('jwt');

            await axios.get(`${BACKEND_URL}/auth/logout`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            checkIfLoggedIn();



            navigate("/login");
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de la déconnexion', error);
        }
    };

    const handleLogin = async () => {

        try {

            navigate("/logged");
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de la connexion ou l\'enregistrement', error);
        }
    };

    return (
        <>
            {loading && (
                <div className="loader">
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                    <p className="doNotTraduct loading-text">Translation in progress ... please wait</p>
                </div>
            )}


            <div>
                <nav className="navbar centerAPPBodyPanel">

                    {/*Ci-dessous nous sommes est connecté */}
                    {isLoggedIn && (

                        <>

                            {/*Ci-dessous nous sommes connecté et ADMIN */}
                            {isAdmin && (
                                <>
                                    <ul className="menu">
                                        <li>
                                            <a href="#">Admin Dashboard</a>
                                            <ul className="submenu">
                                                <li><a href="/admin/manage-users">Manage Users</a></li>
                                                <li><a href="/admin/manage-ligue">Manage Ligue</a></li>
                                                <li><a href="/admin/manage-team">Manage Team</a></li>
                                                <li><a href="/admin/manage-tournament">Manage Tournament</a></li>
                                                <li><a href="/admin/manage-results">Manage Results</a></li>
                                            </ul>
                                        </li>

                                        <li>
                                            <ul className="menu">
                                                <li><a href="/logout" onClick={handleLogout}>Déconnexion</a></li>
                                                <li><a href="/about">À propos</a></li>
                                                <li><a href="/metrics">Metriques Web</a></li>
                                            </ul>
                                        </li>
                                    </ul>


                                </>
                            )}

                            {/*Ci-dessous nous sommes connecté mais PAS ADMIN */}
                            {!isAdmin && (
                                <ul className="menu">

                                    <li><a href="/admin/tournament">Démo Gérer Tournois</a></li>
                                    <li><a href="/about">À propos</a></li>
                                    <li><a href="/metrics">Metriques Web</a></li>
                                    {isLoggedIn && (
                                        <li><a href="/logout" onClick={handleLogout}>Déconnexion</a></li>
                                    )}
                                </ul>
                            )}
                        </>

                    )
                    }

                    {/*Ci-dessous nous sommes PAS connecté */}
                    {!isLoggedIn && (
                        <ul className="menu">

                            <li><a href="/login" onClick={handleLogin}>Connexion</a></li>
                            <li><a href="/signup" onClick={handleLogin}>Inscription</a></li>
                            <li><a href="/about">À propos</a></li>


                        </ul>
                    )

                    }

                </nav>

                <Select
                    options={languages}
                    onChange={changeLanguage}
                    defaultValue={{ value: 'fr', label: 'Français (FR)' }}
                    value={languages.find(option => option.value === actualLang)}
                    isSearchable
                    className="doNotTraduct"
                    placeholder="Choisissez une langue"
                    style={{ float: 'right', width: '80px' }}
                />
            </div>

        </>
    );
}

export default Translate;
