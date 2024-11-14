import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import i18n from '../js/i118n.js'; // Importer l'instance i18n
import axios from 'axios';
import Select from 'react-select';

import '../css/style.css';
import { Margin } from '@mui/icons-material';




function Translate() {

    const { i18n } = useTranslation();
    const [actualLang, setActualLang] = useState(() => {
        // Récupérer la langue depuis localStorage ou utiliser 'fr' par défaut
        return localStorage.getItem('selectedLang') || 'fr';
      });
    const [newLang, setNewLang] = useState('');

    const [languages, setLanguages] = useState([]);
    const LIBRETRANSLATE_SERVER = import.meta.env.VITE_LIBRETRANSLATE_SERVER;

    
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



    useEffect(() => {
 
        fetchLanguages();
      }, []);

      
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
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('doNotTraduct')) {
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
        if (document.readyState === 'complete') {
       
            const elements = document.body; // On prend tout le body
            
            await translateNode(elements, targetLang);
        }

    };

    // Traduire la page au chargement du composant
    useEffect(() => {
        const onPageLoad = async () => {
            await translatePage(actualLang);
        };

        // On verifie que le statut 400 complete n'est pas un appel à libretranslate sinon on va boucler !
        const currentUrl = document.URL;
        const isCorrectUrl = currentUrl.includes(`${LIBRETRANSLATE_SERVER}`);

        // Vérifie si la page est déjà complètement chargée
        if (document.readyState === 'complete' && !isCorrectUrl) {
            if(actualLang!='fr')
                onPageLoad();
        }
    }, [actualLang]);

   
    return (
        <>
        <div>
       
            <nav className="navbar centerAPPBodyPanel">
      <ul>
        <li><a href="/login">Connexion</a></li>
        <li><a href="/signup">Inscription</a></li>
        <li><a href="/about">À propos</a></li>
        <li><a href="/metrics">Metriques Web</a></li>
      </ul>




    </nav>
    
    <Select
          options={languages}
          onChange={changeLanguage}
          defaultValue={{ value: 'fr', label: 'Français (FR)' }}
          value={languages.find(option => option.value === actualLang)}
          isSearchable
          className="doNotTraduct"
          placeholder="Choisissez une langue"
          style={{ float: 'right', width: '80px'}}
        />

    </div>

  
        </>
    );

}

export default Translate;
