// LoginPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import Toast from './Toast.jsx';
import { motion } from 'framer-motion';
import { ElectricBikeSharp } from '@mui/icons-material';
import '../css/style.css';
import '../css/toast.css';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


function FormRegister({ isSignup = false,urlPost = '', onSubmit }) {

    var isConnexion = true;

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastDuration, setToastDuration] = useState(3000);
    
    const [toastType, setToastType] = useState('');
    const [isAnimating, setIsAnimating] = useState(false); // Animation pour la redirection
    const [isFirstLoad, setIsFirstLoad] = useState(true); // Animation de chargement
    const navigate = useNavigate();

    setSourceMapRange('LoginPage');

    


    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPassword = (isConnected, pass) => {
       
        //on valide la taille du password seulement pour les inscriptions pas les connexions
        if(isConnected  )
            return true;

        return ( !(typeof pass === 'string'))|| (pass.length  > 11);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        {isSignup && (isConnexion=false)}

        if (!isValidPassword(true,password)) {
            setToastType('error');
            setToastMessage('Une taille minimum de 12 caractères est requis sur votre champs mot de passe.');
            return;
        }


        if (!isValidPassword(username)) {
            setToastType('error');
            setToastMessage('Veuillez entrer un email valide');
            return;
        }

        try {
            var rest = null;
        
            const res = await axios.post(
                `${API_BASE_URL}${urlPost}`,
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    withCredentials: false,
                }
            );
        
            
            
            const { jwt, message } = res.data;
    

            // Stocker le token JWT dans le localStorage
            localStorage.setItem('jwt', jwt);

            setToastType('success');

            if(isConnexion)
                setToastMessage('Connexion réussie');
            else
                setToastMessage('Si votre code de service est valide, vous recevrez un mail de noreply@ pour valider votre inscirption. Vérifiez vos spams.');




            setTimeout(() => {
                
            // Déclencher l'animation de fondu avec flou
            setIsFirstLoad(false);
            setIsAnimating(true);

                navigate('/logged');

            }, 2000); // Délai pour laisser l'animation du ToastMessage se dérouler

        } catch (error) {
           


            const  errorMessage = error.response?.data?.message
            const  statusCode = error.response?.data?.status

            {isSignup && (setToastDuration(17000))}

            if(isConnexion)
            {
                console.error('Erreur de connexion:', error);
                
                setToastType('error');
                setToastMessage(errorMessage);
    
            }else{
                console.error("Erreur lors d'inscription:", error);
                if(statusCode==601)
                    setToastMessage("Une erreur est survenue. Il semble que vous soyez déjà inscrit. Si vous n'aveiez pas valider votre adresse email, vérifier votre boite de réception.");
                else
                    setToastMessage("Une erreur est survenue. Envoyez un email à l'adresse de contact avec votre heure de t'entative d'inscription si le problème persiste");
                
                 setToastDuration(20000);
                setToastType('error');
                
            }
       

        }
    };

    // Variantes d'animation
    const animationVariants = {
        initial: { x: '-100vw', y: '-100vh', scale: 1 },
        moveAround: {
            x: [0, 100, 0, -100, 0],
            y: [0, -100, 0, 100, 0],
            transition: { duration: 2, ease: 'easeInOut' },
        },
        stabilize: {
            x: 0,
            y: 0,
            transition: { duration: 0.5 },
        },
        stabilize2: {
            x: 0,
            y: 0,
            transition: { duration: 0 },
        },
        rotate: {
            rotate: 360,
            transition: { duration: 1, ease: 'easeInOut' },
        },
        exitAnimation: { opacity: 0, filter: 'blur(10px)', transition: { duration: 1.5 } },

    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ maxWidth: '400px', margin: 'auto', marginTop: 10 }}
        >
            <motion.div
                initial="initial"
                animate={
                    isFirstLoad ? ["moveAround", "stabilize", "rotate"]
                    : isAnimating ? ["stabilize2","exitAnimation"]
                    : "initial"
                }
                variants={animationVariants}
                style={{ width: '100%', maxWidth: 400 }}
            >

<div className="login-container">
        <div className="login-box">



        {!isSignup && (<h2>Connexion</h2>)}
        {isSignup && (<h2>Inscription</h2>)}

                <form
                    onSubmit={handleSubmit}
                  
                >
                {isSignup && (
                <div className="input-container">
           
                    
        <TextField
                        label="Service ID"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        required placeholder="Entrez votre Service ID"
                    />
                    
                </div>
                )}
                <div className="input-container">
                 
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required placeholder="Entrez votre email"
                    />
                  
                </div>
                <div className="input-container">
                
                    {!isSignup && (
                    <TextField
                        label="Mot de passe"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required placeholder="Entrez votre mot de passe"
                    />
              
                    )}
                         {isSignup && (
                    <TextField
                        label="Mot de passe"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required placeholder="Entrez votre mot de passe (taille de 12 minimum)"
                    />
              
                    )}
  </div>

                {!isSignup && (
                <Button
                className="login-button"
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                       
                        sx={{ mt: 2 }}>
                    Se connecter
                    </Button>
                 )}
                {isSignup && (
                <Button
                className="login-button"
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                       
                        sx={{ mt: 2 }} > 
                    S'inscire
                    </Button>
                 )}
            </form>
        </div>
    </div>


                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage('')}
                />
            </motion.div>
        </Box>
    );
}
export default FormRegister;