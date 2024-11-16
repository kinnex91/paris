import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoggedInRoute = ({ isLoggedIn, setToastMessage }) => {
    useEffect(() => {
        if (!isLoggedIn) {
            // Afficher le message d'erreur avec le toast
            setToastMessage('Vous devez être connecté pour accéder à cette page.');
            toast.error('Vous devez être connecté pour accéder à cette page.', {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [isLoggedIn]);

    return (
        <>
            <ToastContainer />
            {isLoggedIn ? <Outlet /> : <Navigate to="/login" />}
        </>
    );
};

export default LoggedInRoute;
