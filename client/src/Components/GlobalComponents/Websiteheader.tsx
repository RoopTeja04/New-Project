import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import useAuthStore from "../../stores/authStores";

const WebsiteHeader = () => {
  const { isAuthenticated, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <>
      <div className="bg-blue-950 text-white h-16 w-full flex justify-between">
        <div className="flex gap-6 items-center text-base px-5">
          <Link to="">Home</Link>
          <Link to="about">About</Link>
        </div>
        <div className="flex gap-6 items-center text-base px-5">
          {isAuthenticated ? (
            <Link to="dashboard">Dashboard</Link>
          ) : (
            <>
              <Link to="create">Create</Link>
              <Link to="login">Login</Link>
            </>
          )}
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default WebsiteHeader;
