import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

const Invite = () => {
  const Data = {
    name: "",
    password: "",
  };

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [InviteData, setInviteData] = useState(Data);
  const [error, setError] = useState<string>("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000d24] px-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center border-b border-gray-400 pb-2">
          Aceept Invitation
        </h1>

        <div className="flex flex-col space-y-2 w-full mt-4">
          <label className="font-bold text-gray-700">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={InviteData.name}
              placeholder="Enter your Name"
              className={`${error === "name" || error === "all" || error === "Invalid Name" ? "border-red-500" : "border-gray-300"} w-full border-2 rounded-lg p-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invite;
