import React, { useState } from "react";
import axios from "axios";
import {
  NOT_LOGGED_IN,
  LOG_IN_FORM,
  REGISTRATION_FORM,
  LOGGED_IN,
} from "../constants/AuthStatus";
import Swal from "sweetalert2";

const AppContext = React.createContext();

const AppProvider = (props) => {
  let hostName = "";
  if (process.env.NODE_ENV === "development") {
    hostName = "http://localhost:9000/";
  } else if (process.env.NODE_ENV === "production") {
    hostName = "http://backend.inovora.co.tz/";
  }

  const [authStatus, setAuthStatus] = useState(NOT_LOGGED_IN);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState("");
  const [userNameInput, setUserNameInput] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState("");

  function changeAuthStatusLogin() {
    setAuthStatus(LOG_IN_FORM);
  }

  function changeAuthStatusRegister() {
    setAuthStatus(REGISTRATION_FORM);
  }

  function handleUserNameInput(changeEvent) {
    let updatedUserName = changeEvent.target.value;
    setUserNameInput(updatedUserName);
  }

  function handleUserEmail(changeEvent) {
    let updatedUserEmail = changeEvent.target.value;
    setUserEmail(updatedUserEmail);
  }

  function handleUserPassword(changeEvent) {
    let updatedUserPassword = changeEvent.target.value;
    setUserPassword(updatedUserPassword);
  }

  function handleUserRole(changeEvent) {
    let updatedUserRole = changeEvent.target.value;
    setUserRole(updatedUserRole);
  }

  const signup = () => {
    axios.defaults.withCredentials = true;
    // CSRF COOKIE
    axios.get(hostName + "sanctum/csrf-cookie").then(
      (response) => {
        //console.log(response);
        // SIGNUP / REGISTER
        axios
          .post(hostName + "api/register", {
            name: userNameInput,
            email: userEmail,
            password: userPassword,
            role: userRole,
          })
          .then(
            (response) => {
              //console.log(response);
              // GET USER
              axios.get(hostName + "api/user").then(
                (response) => {
                  //console.log(response);
                  setUserId(response.data.id);
                  setUserName(response.data.name);
                  setErrorMessage("");
                  setAuthStatus(LOGGED_IN);
                },
                // GET USER ERROR
                (error) => {
                  setErrorMessage("Could not complete the registration");
                }
              );
            },
            // SIGNUP ERROR
            (error) => {
              console.log(error);
              if (error.response.data.errors.name) {
                setErrorMessage(error.response.data.errors.name[0]);
              } else if (error.response.data.errors.email) {
                setErrorMessage(error.response.data.errors.email[0]);
              } else if (error.response.data.errors.password) {
                setErrorMessage(error.response.data.errors.password[0]);
              } else if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
              } else {
                setErrorMessage("Could not complete the registration");
              }
            }
          );
      },
      // COOKIE ERROR
      (error) => {
        setErrorMessage("Could not complete the registration");
      }
    );
  };

  const login = () => {
    axios.defaults.withCredentials = true;
    // CSRF COOKIE
    axios.get(hostName + "sanctum/csrf-cookie").then(
      (response) => {
        //console.log(response);
        // LOGIN
        axios
          .post(hostName + "api/login", {
            email: userEmail,
            password: userPassword,
          })
          .then(
            (response) => {
              console.log(response.data);
              // GET USER
              if (response.data.status === "success") {
                Swal.fire({
                  title: "Success",
                  text: response.data.message,
                  type: response.data.status,
                  icon: "success",
                  timer: 2000,
                });
              }
              axios.get(hostName + "api/user").then(
                (response) => {
                  //console.log(response);
                  setUserId(response.data.id);
                  setUserName(response.data.name);
                  setErrorMessage("");
                  setAuthStatus(LOGGED_IN);
                },
                // GET USER ERROR
                (error) => {
                  Swal.fire({
                    title: "Error",
                    text: "Could not complete the login",
                    icon: "warning",
                    timer: 2000,
                  });
                  setErrorMessage("Could not complete the login");
                }
              );
            },
            // LOGIN ERROR
            (error) => {
              if (error.response) {
                Swal.fire({
                  title: "Error",
                  text: error.response.data.message,
                  type: response.data.status,
                  icon: "error",
                  timer: 2000,
                });
                setErrorMessage(error.response.data.message);
              } else {
                setErrorMessage("Could not complete the login");
              }
            }
          );
      },
      // COOKIE ERROR
      (error) => {
        setErrorMessage("Could not complete the login");
      }
    );
  };

  function logout() {
    axios.defaults.withCredentials = true;
    axios.get(hostName + "api/logout");
    setUserId(0);
    setUserName("");
    setUserNameInput("");
    setUserEmail("");
    setUserPassword("");
    setAuthStatus(NOT_LOGGED_IN);
  }

  return (
    <AppContext.Provider
      value={{
        authStatus,
        changeAuthStatusLogin,
        changeAuthStatusRegister,
        userId,
        userName,
        userNameInput,
        userEmail,
        userPassword,
        handleUserNameInput,
        handleUserEmail,
        handleUserPassword,
        handleUserRole,
        signup,
        login,
        logout,
        errorMessage,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
