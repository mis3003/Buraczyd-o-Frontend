import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

// Typ dla propsów komponentu
interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    return isAuthenticated() ? (
        <>{children}</> // Jeśli użytkownik jest zalogowany, renderuj dzieci
) : (
        <Navigate to="/login" replace /> // W przeciwnym razie przekieruj do logowania
);
};

export default PrivateRoute;
