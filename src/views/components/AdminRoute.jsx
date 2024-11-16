const AdminRoute = ({  isLoggedIn }) => {
    return isLoggedIn  ? <Outlet /> : <Navigate to="/requestAdminAndNotAdmin" />;
};

export default AdminRoute;
