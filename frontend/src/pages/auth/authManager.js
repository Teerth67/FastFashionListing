import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

const AuthManager = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lastVisitedPage, setLastVisitedPage] = useState("/");

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Save the last visited page when modal opens
  const openLogin = () => {
    setLastVisitedPage(location.pathname);
    setShowLogin(true);
    setShowRegister(false);
  };

  const openRegister = () => {
    setLastVisitedPage(location.pathname);
    setShowRegister(true);
    setShowLogin(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
    navigate(lastVisitedPage); // Navigate back to the last visited page
  };

  return (
    <>
      {/* Render children and pass openLogin and openRegister functions */}
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { openLogin, openRegister })
      )}

      {/* Auth Modals */}
      <Login
        isModalOpen={showLogin}
        closeModal={closeModals}
        switchToRegister={openRegister}
      />
      <Register
        isModalOpen={showRegister}
        closeModal={closeModals}
        switchToLogin={openLogin}
      />
    </>
  );
};

export default AuthManager;