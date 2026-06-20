import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className="min-h-screen flex">
        <div className="w-[20%] border-r-2 border-gray-300">
          <h1>SideBar</h1>
        </div>

        <div className="w-full flex-1 h-full bg-white">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
