// src/Components/Route/ProtectedRoutes.jsx
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Updated import path
import { Navigate, Route } from "react-router-dom";

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const { user } = useContext(AuthContext); // Assuming AuthContext provides a user state

    return (
        <Route
            {...rest}
            element={user ? <Component /> : <Navigate to="/login" />} // Redirect to login if not authenticated
        />
    );
};

export default ProtectedRoute;
