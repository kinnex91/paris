import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import i18n from '../js/i118n.js'; // Importer l'instance i18n
import axios from 'axios';
import Select from 'react-select';

import '../css/style.css';
import '../css/loader.css';
import '../css/menu.css';

import { Margin } from '@mui/icons-material';
import ClipLoader from 'react-spinners/ClipLoader';//pour le loader



function Translate() {

    const { i18n } = useTranslation();
    const [actualLang, setActualLang] = useState(() => {
        // Récupérer la langue depuis localStorage ou utiliser 'fr' par défaut
        return localStorage.getItem('selectedLang') || 'fr';
    });
    const [newLang, setNewLang] = useState('');
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(false); // État pour le loader
    const LIBRETRANSLATE_SERVER = import.meta.env.VITE_LIBRETRANSLATE_SERVER;
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [isAdmin, setIsAdmin] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkIfLoggedIn = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.get(`${BACKEND_URL}/auth/is-logged-in`, {
                headers: {
                    Authorization: `Bearer ${token}`,           
                },
            });
            setIsLoggedIn(response.data.isLoggedIn);
        } catch (error) {
            console.error('Erreur lors de la vérification de la connexion', error);
        }
    };

    const checkIfAdmin = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.get(`${BACKEND_URL}/auth/is-admin`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setIsAdmin(response.data.isAdmin);
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'administrateur', error);
        }
    };

    // Fonction pour récupérer la liste des langues supportées depuis l'API
    const fetchLanguages = async () => {
        try {

            const response = await axios.get(`${LIBRETRANSLATE_SERVER}/languages`, {


            });
            const languageOptions = response.data.map((lang) => ({
                value: lang.code,
                label: `${lang.name} (${lang.code.toUpperCase()})`,
            }));

            setLanguages(languageOptions);

        } catch (error) {
            console.error('Erreur lors de la récupération des langues:', error);
        }
    };


    const changeLanguage = (select_var) => {
        var lang = select_var.value;
        setActualLang(newLang);
        setNewLang(lang);


        i18n.changeLanguage(lang);
        translatePage(lang);

        // pour sauevagrder la langue sélectionnée quand on changera de page
        localStorage.setItem('selectedLang', lang);
    };
    const translateText = async (text, targetLang) => {
        try {
         

            const response = await axios.post(`${LIBRETRANSLATE_SERVER}/translate`, {
                q: text,
                source: 'auto',
                target: targetLang,
                format: 'text',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
            });
            return response.data.translatedText;
        } catch (error) {
            console.error('Erreur lors de la traduction:', error);
            return text;
        }
    };

    const translateNode = async (node, targetLang) => {
        // Ignorer les éléments avec la classe "doNotTraduct"
        if (
            node.nodeType === Node.ELEMENT_NODE &&
            (node.classList.contains('doNotTraduct') ||
                node.tagName.toUpperCase() === 'SCRIPT' ||
                node.tagName.toUpperCase() === 'NOSCRIPT')
        ) {
            return; // Ne pas traduire cet élément
        }

        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            // Si c'est un nœud de texte non vide, on le traduit
            const translatedText = await translateText(node.textContent, targetLang);
            node.textContent = translatedText;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Si c'est un élément, on traite chaque enfant
            for (const childNode of node.childNodes) {
                await translateNode(childNode, targetLang);
            }
        }
    };

    const translatePage = async (targetLang) => {
        if(targetLang=='')
            return;

        setLoading(true); // Activer le loader

        if (document.readyState === 'complete') {

            const elements = document.body; // On prend tout le body

            await translateNode(elements, targetLang);
        }
        setLoading(false); // Désactiver le loader

    };

    // Traduire la page au chargement du composant
    useEffect(() => {

        checkIfLoggedIn();
        checkIfAdmin();
        fetchLanguages();

        const onPageLoad = async () => {
            await translatePage(actualLang);
        };

        // On verifie que le statut 400 complete n'est pas un appel à libretranslate sinon on va boucler !
        const currentUrl = document.URL;
        const isCorrectUrl = currentUrl.includes(`${LIBRETRANSLATE_SERVER}`);

        // Vérifie si la page est déjà complètement chargée
        if (document.readyState === 'complete' && !isCorrectUrl) {
            if (actualLang != 'fr')
                onPageLoad();
        }
    }, [actualLang]);


    return (
        <>
            {/* Afficher le loader si la traduction est en cours */}
            {loading && (
                <div className="loader">
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                    <p className="doNotTraduct loading-text">Translation in progress ... please wait</p>
                </div>
            )}

            {!loading && (
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
                                        {!isLoggedIn && (
                                            <li><a href="/login">Connexion</a></li>
                                        )}
                                        {isLoggedIn && (
                                            <li><a href="/logout">Déconnexion</a></li>
                                        )}

                                        <li><a href="/signup">Inscription</a></li>
                                        <li><a href="/about">À propos</a></li>
                                        <li><a href="/metrics">Metriques Web</a></li>
                                    </ul>
                                )}
                            </>

                        )
                        }

                          {/*Ci-dessous nous sommes PAS connecté */}
                        {!isLoggedIn && (
                            <ul className="menu">

                                <li><a href="/login">Connexion</a></li>
                                <li><a href="/signup">Inscription</a></li>
                                <li><a href="/about">À propos</a></li>
                                <li><a href="/metrics">Metriques Web</a></li>
                            </ul>
                        )

                        }

                    </nav>
                    
                    {/*FEATURES-XXX As a user connected or not if my default language is the same that the language display page on this site remove this select box and dont' call the default route /list-language to improve performance and user experience */}
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
            )}
        </>
    );

}

export default Translate;
