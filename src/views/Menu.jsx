import React from 'react';
import '../css/style.css';
import { useTranslation } from 'react-i18next';
import i18n from '../js/i118n.js'; // Importer l'instance i18n
import axios from 'axios';

//MENU IS DEPRECATED WE USE Translate.jsx instead with dynamic trdacution by axios on librestranslte local server adressed by a docker
function Menu() {

  
    return (
        <>
            <nav className="navbar centerAPPBodyPanel">
      <ul>
        <li><a href="/login">Connexion</a></li>
        <li><a href="/signup">Inscription</a></li>
        <li><a href="/about">À propos</a></li>
        <li><a href="/metrics">Metriques Web</a></li>
      </ul>
      <button onClick={() => changeLanguage('en')} className="doNotTraduct">English</button>
      <button onClick={() => changeLanguage('fr')} className="doNotTraduct">Français</button>
    </nav>


  
        </>
    );
}

export default Menu;
