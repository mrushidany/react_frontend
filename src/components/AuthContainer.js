import React, { useContext } from "react";
import {
  NOT_LOGGED_IN,
  LOG_IN_FORM,
  REGISTRATION_FORM,
  LOGGED_IN,
} from "../constants/AuthStatus";
import AuthNotLoggedIn from "./AuthNotLoggedIn";
import AuthRegister from "./AuthRegister";
import AuthLogin from "./AuthLogin";
import AuthLogout from "./AuthLogout";
import { AppContext } from "../contexts/AppContext";

const AuthContainer = () => {
  const appContext = useContext(AppContext);
  const { authStatus, errorMessage } = appContext;
  const showNotLoggedIn = authStatus === NOT_LOGGED_IN ? "" : "hidden";
  const showLoginForm = authStatus === LOG_IN_FORM ? "" : "hidden";
  const showRegisterForm = authStatus === REGISTRATION_FORM ? "" : "hidden";
  const showLoggedIn = authStatus === LOGGED_IN ? "" : "hidden";

  return (
    <div className="w-full">
      <div className={showNotLoggedIn + " justify-end py-4"}>
        <AuthNotLoggedIn />
      </div>
      <div className={showLoginForm + " justify-end py-4"}>
        <AuthLogin option="login" />
      </div>
      <div className={showRegisterForm + " justify-end py-4"}>
        <AuthRegister option="register" />
      </div>
      <div className={showLoggedIn + " justify-end py-4"}>
        <AuthLogout />
      </div>
    </div>
  );
};

export default AuthContainer;
