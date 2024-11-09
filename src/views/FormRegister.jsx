// LoginPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import Toast from './Toast.jsx';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://localhost:3007';



function FormRegister({ isSignup = false, onSubmit }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [isAnimating, setIsAnimating] = useState(false); // Animation pour la redirection
    const [isFirstLoad, setIsFirstLoad] = useState(true); // Animation de chargement
    const navigate = useNavigate();

    setSourceMapRange('LoginPage');

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(username)) {
            setToastType('error');
            setToastMessage('Veuillez entrer un email valide');
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
            const { jwt, message } = res.data;

            // Stocker le token JWT dans le localStorage
            localStorage.setItem('jwt', jwt);

            setToastType('success');
            setToastMessage(message || 'Connexion réussie');

            // Déclencher l'animation de fondu avec flou
            setIsFirstLoad(false);
            setIsAnimating(true);
            setTimeout(() => navigate('/recipes'), 2000); // Délai de 2 secondes pour laisser l'animation se dérouler

        } catch (error) {
            console.error('Erreur de connexion:', error);
            const errorMessage = error.response?.data?.message || 'Erreur lors de la connexion';
            setToastType('error');
            setToastMessage(errorMessage);
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

<div class="login-container">
        <div class="login-box">



        {!isSignup && (<h2>Connexion</h2>)}
        {isSignup && (<h2>Inscription</h2>)}

                <form
                    onSubmit={handleSubmit}
                  
                >
                {isSignup && (
                <div class="input-container">
                    <label for="serviceId">Service ID</label>
                    
        <TextField
                        label="Service ID"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value=""
                        onChange={(e) => setUsername(e.target.value)}
                        required placeholder="Entrez votre Service ID"
                    />
                    
                </div>
                )}
                <div class="input-container">
                    <label for="email">Email</label>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required placeholder="Entrez votre email"
                    />
                  
                </div>
                <div class="input-container">
                    <label for="password">Mot de passe</label>
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
                        sx={{ mt: 2 }}>
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