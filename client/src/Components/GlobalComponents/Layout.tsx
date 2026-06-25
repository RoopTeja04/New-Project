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

  console.log("company data: ", companyData);

  return (
    <>
      <div className="min-h-screen flex bg-[#000d24] text-white">
        <div className="w-[15%] border-r-2 border-[#2e3b51] px-4 py-8">
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

        <div className="w-full flex-1 h-full bg-transparent">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
