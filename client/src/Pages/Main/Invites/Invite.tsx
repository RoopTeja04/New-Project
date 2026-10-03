import { useState } from "react";
import { FaUser, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import useInviteStore from "../../../stores/InviteStores";

const Invite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { respondToInvitation } = useInviteStore();

  const [inviteData, setInviteData] = useState({
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const validateInvitation = (status: string) => {
    if (!token) {
      setError("token");
      return false;
    }

    if (status === "Accept") {
      if (!inviteData.name.trim()) {
        setError("name");
        return false;
      }

      if (!inviteData.password.trim()) {
        setError("password");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleInvitationBtn = async (status: string) => {
    if (!validateInvitation(status)) {
      return;
    }
    setLoading(status);

    try {
      const payload = {
        token,
        status,
        ...(status === "Accept"
          ? { name: inviteData.name.trim(), password: inviteData.password }
          : {}),
      };

      const res = await respondToInvitation(payload);
      toast.success(
        res?.data?.message || `Invitation ${status}ed successfully`,
      );
      navigate("/login");
    } catch (err: any) {
      const backendError =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while processing the invitation.";
      toast.error(backendError);
      setError("server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000d24] px-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center border-b border-gray-400 pb-2">
          Accept Invitation
        </h1>

        <div className="flex flex-col space-y-2 w-full mt-4">
          <label className="font-bold text-gray-700">Name</label>
          <div className="relative">
            <input
              type="text"
              value={inviteData.name}
              placeholder="Enter your name"
              onChange={(e) => {
                setInviteData({ ...inviteData, name: e.target.value });
                if (
                  error === "name" ||
                  error === "all" ||
                  error === "Invalid Name"
                ) {
                  setError("");
                }
              }}
              className={`${error === "name" || error === "all" || error === "Invalid Name" ? "border-red-500" : "border-gray-300"} w-full border-2 rounded-lg p-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
          </div>

          {(error === "name" || error === "all") && (
            <p className="text-red-500 font-medium text-sm">Name is required</p>
          )}
          {error === "invalidEmail" && (
            <p className="text-red-500 font-medium text-sm">
              Please enter a valid name
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-2 w-full mt-4">
          <label className="font-bold text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={inviteData.password}
              placeholder="Enter your password"
              onChange={(e) => {
                setInviteData({ ...inviteData, password: e.target.value });
                if (error === "password" || error === "all") {
                  setError("");
                }
              }}
              className={`${error === "password" || error === "all" ? "border-red-500" : "border-gray-300"} w-full border-2 rounded-lg p-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-lg" />
              ) : (
                <FaEye className="text-lg" />
              )}
            </button>
          </div>

          {(error === "password" || error === "all") && (
            <p className="text-red-500 font-medium text-sm">
              Password is required
            </p>
          )}
          {error === "token" && (
            <p className="text-red-500 font-medium text-sm">
              Invitation token is missing or invalid
            </p>
          )}
        </div>

        <div className="w-full flex space-x-4 mt-6 mb-2">
          <button
            onClick={() => handleInvitationBtn("Reject")}
            className="w-full bg-gray-400 py-3 rounded-lg hover:bg-gray-600 hover:text-white duration-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading === "Reject" ? "Processing..." : "Cancel"}
          </button>
          <button
            onClick={() => handleInvitationBtn("Accept")}
            className="w-full bg-green-600 py-3 rounded-lg cursor-pointer hover:bg-green-800 transition-all duration-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading === "Accept" ? "Processing..." : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invite;
