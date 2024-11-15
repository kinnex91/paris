import React from 'react';
import '../css/style.css';
import { useTranslation } from 'react-i18next';
import i18n from '../js/i118n.js'; // Importer l'instance i18n
import axios from 'axios';

//THIS MENU IS DEPRECATED WE USE Translate.jsx instead with dynamic trdacution by axios on librestranslte local server adressed by a docker
//FEATURES-XXX : manage 3 différents king of menu each in its own component for connected admin, connected user and none connected to improve quality code,
function Menu() {

  const [isAdmin, setIsAdmin] = useState(false);
  const LIBRETRANSLATE_SERVER = import.meta.env.VITE_LIBRETRANSLATE_SERVER;

  const checkIfAdmin = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${LIBRETRANSLATE_SERVER}/auth/is-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'administrateur', error);
    }
  };

  useEffect(() => {
    checkIfAdmin();
  }, []);
  
    return (
        <>
            <nav className="navbar centerAPPBodyPanel">
            {!isAdmin && (
               <ul>
                <li><button className="doNotTraduct">Admin Dashboard</button></li>
                <li><button className="doNotTraduct">Manage Users</button></li>
               </ul>
          
        )}

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
