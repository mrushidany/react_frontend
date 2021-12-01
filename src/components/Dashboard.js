import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Dashboard = () => {
  const appContext = useContext(AppContext);
  const { userName, logout } = appContext;

  return (
    <div className="flex w-full justify-center bg-white">
      <p>Welcome to the Dashboard</p>
    </div>
  );
};
export default Dashboard;
