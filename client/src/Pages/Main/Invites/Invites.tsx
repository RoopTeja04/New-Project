import React from "react";
import { IoIosPersonAdd } from "react-icons/io";
import useCompanyMembersStore from "../../../stores/companyMemberStores";
import useCompanyStore from "../../../stores/companyStores";

const Invites = () => {
  const { companyData } = useCompanyStore();
  const { getCompanyMembers, members, loading } = useCompanyMembersStore();

  React.useEffect(() => {
    if (companyData?._id) {
      getCompanyMembers(companyData._id);
    }
  }, [companyData?._id]);

  console.log(members);

  return (
    <>
      <div className="flex-1 p-8">
        <div className="border-2 border-[#2e3b51] p-5 rounded-lg flex items-center justify-between">
          <h1 className="font-bold text-2xl">Employee Invites</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer hover:bg-green-700 transition duration-200">
            <IoIosPersonAdd /> <p className="text-sm font-medium">New Invite</p>
          </button>
        </div>

        <div className="border-2 border-[#2e3b51] mt-10 py-8 px-4 rounded-lg">
          <h1 className="text-lg font-medium">Company Employess</h1>
        </div>
      </div>
    </>
  );
};

export default Invites;
