import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const LoggedInRoute = ({ isLoggedIn }) => {
    return isLoggedIn ? <Outlet /> : <Navigate to="/requestLoggedInAndNotLoggedIn" />;
};

export default LoggedInRoute;
