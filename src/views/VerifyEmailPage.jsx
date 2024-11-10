import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/style.css';
import Toast from './Toast.jsx';

function VerifyEmailPage() {
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');

    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();

    // Récupérer le token à partir de l'URL
    const token = searchParams.get('token');

    // Récupérer l'URL de l'API à partir de la variable d'environnement
    const apiHost = "https://server.pronostics.devforever.ovh";

    // Fonction pour vérifier l'email
    const verifyEmail = async () => {
        if (!token) {
            setMessage('Token is missing');
            return;
        }

        try {
            // Faire l'appel API pour vérifier l'email
            console.log(`${apiHost}/auth/verify-email?token=${token}`)
            const response = await axios.get(`${apiHost}/auth/verify-email?token=${token}`);

            if (response.data.message === 'Email successfully verified') {
                console.log('ok');
                setIsVerified(true);
                setToastType('success');
                setToastMessage('Vous avez correctement vérifié votre email, attendez que l’administrateur valide votre inscription.\n\n\n Veuillez vous connecter.');

                // Rediriger vers /login après 5 secondes
                
                setTimeout(() => {
                  navigate('/login');
                }, 6000);
                
            } else {
                setMessage('Une erreur est survenue lors de la vérification de votre email.');
            }
        } catch (error) {
            setMessage('Erreur lors de la vérification du token. Veuillez réessayer.');
            console.error('Error:', error);
        }
    };

    // Utiliser useEffect pour déclencher la vérification lorsque le composant est monté
    useEffect(() => {
        verifyEmail();
    }, []);

    return (
        <>
            <div className="verify-email-container">
                {isVerified ? (
                    <div className="success-message">{message}</div>
                ) : (
                    <div className="error-message">{message || 'Vérification en cours...'}</div>
                )}
            </div>

            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />

        </>
    );
}

export default VerifyEmailPage;
