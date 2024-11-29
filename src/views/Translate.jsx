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

  
    useEffect(() => {
   

        fetchLanguages();

        if (actualLang != 'en')
            translatePage(actualLang);

    }, [location]); // Refresh chaque fois que la route change

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

    return (
        <>
            {loading && (
                <div className="loader">
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                    <p className="doNotTraduct loading-text">Translation in progress ... please wait</p>
                </div>
            )}


            <div>
            <Select
                    options={languages}
                    onChange={changeLanguage}
                    defaultValue={{ value: 'en', label: 'English (EN)' }}
                    value={languages.find(option => option.value === actualLang)}
                    isSearchable
                    className="doNotTraduct"
                    placeholder="Choose language"
                    style={{ float: 'right', width: '80px' }}
                />
               
            </div>

        </>
    );
}

export default Translate;
