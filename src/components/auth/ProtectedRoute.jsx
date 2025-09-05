/**
 * ProtectedRoute & PublicRoute
 * - PublicRoute: empêche d'accéder à /login /signup quand déjà connecté
 * - ProtectedRoute: bloque l'accès aux pages privées si non connecté (+ RBAC)
 */

import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Pages accessibles SEULEMENT si NON connecté (ex: login/register)
export function PublicRoute({ children }) {
  const token = localStorage.getItem("token") || localStorage.getItem("jwt");
  const location = useLocation();
  if (token) {
    const role = localStorage.getItem("userRole");
    const redirectPath = role === "admin" ? "/admin/dashboard" : "/user/dashboard";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  return children;
}


// Pages accessibles SEULEMENT si connecté (+ rôle optionnel)
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log(`Route access attempt: ${location.pathname}`);
  }, [location.pathname]);

  // Auth via context OU token localStorage
  const isAuthenticated = !!user || !!localStorage.getItem("token");

  if (!isAuthenticated) {
    console.log(`Authentication required for: ${location.pathname}`);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // RBAC optionnel
  if (requiredRole) {
    const userRole = localStorage.getItem("userRole");
    const hasRequiredRole = hasRole ? hasRole(requiredRole) : userRole === requiredRole;

    if (!hasRequiredRole) {
      console.log(`Role ${requiredRole} required for: ${location.pathname}`);
      const redirectPath = userRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
