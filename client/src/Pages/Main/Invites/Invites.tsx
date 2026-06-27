import React from "react";
import { IoIosPersonAdd } from "react-icons/io";
import useCompanyMembersStore from "../../../stores/companyMemberStores";
import useCompanyStore from "../../../stores/companyStores";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import InviteModal from "./InviteModal";

const Invites = () => {
  const { companyData } = useCompanyStore();
  const { getCompanyMembers, members, loading } = useCompanyMembersStore();

  const [showInvite, setShowInvite] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (companyData?._id) {
      getCompanyMembers(companyData._id);
    }
  }, [companyData?._id]);

  return (
    <>
      <div className="flex-1 p-8">
        <div className="border-2 border-[#2e3b51] p-5 rounded-lg flex items-center justify-between">
          <h1 className="font-bold text-2xl">Employee Invites</h1>
          <button
            onClick={() => {
              setShowInvite(!showInvite);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer hover:bg-green-700 transition duration-200"
          >
            <IoIosPersonAdd /> <p className="text-sm font-medium">New Invite</p>
          </button>
        </div>

        <div className="border-2 border-[#2e3b51] mt-10 py-8 px-4 rounded-lg">
          <div className="flex items-center justify-between px-2">
            <h1 className="text-lg font-medium">Company Employess</h1>
            <Link
              to="/dashboard/invites-history"
              className="underline underline-offset-4 tracking-wide font-normal"
            >
              Invite History
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-8">
            {members.map((member) => (
              <div
                key={member._id}
                className="border border-slate-700 rounded-xl p-5 bg-[#08162B] text-white"
              >
                <div className="grid grid-cols-[90px_1fr] gap-6 items-center">
                  <div className="flex justify-center">
                    {member.userID.avatar ? (
                      <img
                        src={member.userID?.avatar}
                        alt={member.userID.name}
                        className="w-auto h-22 rounded-full object-cover border border-slate-600"
                      />
                    ) : (
                      <FaRegCircleUser className="text-8xl text-gray-400" />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center-safe">
                      <p className="text-gray-400 text-xs uppercase">Name</p>
                      <h2 className="text-xl font-semibold">
                        {member.userID?.name}
                      </h2>
                    </div>

                    <hr className="border-slate-700" />

                    <div className="flex justify-between items-center-safe">
                      <p className="text-gray-400 text-xs uppercase">Email</p>
                      <a
                        href={`mailto:${member.userID?.email}`}
                        className="text-gray-300 text-sm"
                      >
                        {member.userID?.email}
                      </a>
                    </div>

                    <hr className="border-slate-700" />

                    <div className="flex justify-between items-center-safe">
                      <p className="text-gray-400 text-xs uppercase">
                        Designation
                      </p>
                      <p className="font-medium">{member.designation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showInvite && (
        <InviteModal showInvite={showInvite} setShowInvite={setShowInvite} />
      )}
    </>
  );
};

export default Invites;
