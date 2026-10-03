import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import useAuthStore from "../../stores/authStores";
import useCompanyStore from "../../stores/companyStores";

const Layout = () => {
  const { userId, checkAuthStatus } = useAuthStore();
  const { getCompany, companyData } = useCompanyStore();

  React.useEffect(() => {
    checkAuthStatus();
  }, []);

  React.useEffect(() => {
    if (userId) {
      getCompany(userId);
    }
  }, [userId]);

  return (
    <>
      <div className="min-h-screen flex bg-[#000d24] text-white overflow-x-hidden">
        <div className="w-[15%] border-r-2 border-[#2e3b51] px-4 py-8 fixed top-0 left-0 h-screen overflow-hidden">
          <h1 className="text-xl font-bold pl-4">{companyData?.companyName}</h1>

          <div className="my-8 flex flex-col gap-4 pl-4">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                isActive
                  ? "pl-2 text-sm font-semibold bg-[#2e3b51] p-2 rounded-md"
                  : "pl-2 text-sm font-semibold hover:bg-[#2e3b51] p-2 rounded-md"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/dashboard/projects"
              className={({ isActive }) =>
                isActive
                  ? "pl-2 text-sm font-semibold bg-[#2e3b51] p-2 rounded-md"
                  : "pl-2 text-sm font-semibold hover:bg-[#2e3b51] p-2 rounded-md"
              }
            >
              Projects
            </NavLink>
            <NavLink
              to="/dashboard/invites"
              className={({ isActive }) =>
                isActive
                  ? "pl-2 text-sm font-semibold bg-[#2e3b51] p-2 rounded-md"
                  : "pl-2 text-sm font-semibold hover:bg-[#2e3b51] p-2 rounded-md"
              }
            >
              Invites
            </NavLink>
            
            <NavLink
              to="/dashboard/company"
              className={({ isActive }) =>
                isActive
                  ? "pl-2 text-sm font-semibold bg-[#2e3b51] p-2 rounded-md"
                  : "pl-2 text-sm font-semibold hover:bg-[#2e3b51] p-2 rounded-md"
              }
            >
              Company
            </NavLink>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 h-screen bg-transparent ml-[15%] overflow-y-auto scrollbar-hide">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
