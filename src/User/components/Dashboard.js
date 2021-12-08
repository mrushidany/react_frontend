import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Dashboard = () => {
  const appContext = useContext(AppContext);
  const { userName, userId, logout } = appContext;

  return (
    <div className="flex w-full justify-center bg-white">
      <p>
        Hello {userName} {userId} welcome to the Dashboard {logout}
      </p>
    </div>
  );
};
export default Dashboard;
