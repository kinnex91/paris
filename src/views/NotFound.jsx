import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/notfound.css';
import '../css/loader.css';

function NotFound() {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    useEffect(() => {
        document.body.classList.add('no-background');

        // Supprimer la classe quand on quitte la page
        return () => {
            document.body.classList.remove('no-background');
        };
    }, []);

    return (
        <div className="error-page">
            {/* Conteneur pour le texte d'erreur animé */}
            <div className="error-container">
                <h1 className="glitch" data-text="404">404</h1>
                <p className="glitch" data-text="Page Not Found">Page Not Found</p>
                <div className="glow-container">
                    <p className="glow-text">Oops! The page you're looking for doesn't exist.</p>
                </div>
                
                {/* Bouton pour revenir à la page d'accueil */}
                <button className="home-button" onClick={goHome}>
                    Back to Home
                </button>
            </div>

            {/* Animation d'un GIF qui se déplace */}
            <div className="gif-container">
                <img 
                    id="moving-gif" 
                    src="/src/images/404.gif" 
                    alt="Animated 404" 
                />
            </div>
        </div>
    );
}

export default NotFound;
