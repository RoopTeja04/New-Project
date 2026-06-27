import React from "react";
import { FaEnvelope, FaUserTie } from "react-icons/fa";
import { IoClose, IoChevronDown } from "react-icons/io5";
import { MdBadge } from "react-icons/md";
import useCompanyStore from "../../../stores/companyStores";
import useAuthStore from "../../../stores/authStores";
import useInviteStore from "../../../stores/InviteStores";

const InviteModal = ({ showInvite, setShowInvite }: any) => {
  const { companyData } = useCompanyStore();
  const { userId } = useAuthStore();
  const { sendInvite, loading, setLoading } = useInviteStore();

  const RoleDropDown = [
    { name: "Sub-Admin", value: "Sub-Admin" },
    { name: "Member", value: "Member" },
  ];

  const DefaultValues = {
    email: "",
    designation: "",
  };

  const [showDropdown, setShowDropdown] = React.useState<boolean>(false);
  const [role, setRole] = React.useState<string>("");
  const [data, setData] = React.useState(DefaultValues);
  const [errors, setErrors] = React.useState({
    email: "",
    role: "",
    designation: "",
  });

  const [success, setSuccess] = React.useState("");
  const [serverError, setServerError] = React.useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmitBtn = async () => {
    setServerError("");
    setSuccess("");
    setLoading(true);

    const newErrors = {
      email: "",
      role: "",
      designation: "",
    };

    if (!data.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!validateEmail(data.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!role) {
      newErrors.role = "Please select a role.";
    }

    if (!data.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.role) return;

    const finalData = {
      companyID: companyData?._id,
      invitedID: userId,
      email: data.email,
      role,
      designation: data.designation,
    };

    try {
      const res = await sendInvite(finalData);
      setSuccess("Invite sent successfully.");

      setData({
        email: "",
        designation: "",
      });

      setRole("");

      setTimeout(() => {
        setSuccess("");
        setShowInvite(false);
      }, 2000);
    } catch (err: any) {
      console.log(err)
      const message = err.message || "Something went wrong.";

      setServerError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-gray-700 bg-[#08111F] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-6 flex items-center justify-between border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-semibold text-white">Invite Member</h2>

          <button
            onClick={() => {
              setShowInvite(!showInvite);
            }}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-700 hover:text-white"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex flex-col space-y-2 w-full mt-4">
          <label className="font-bold text-gray-700">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={data.email}
              onChange={(e) => {
                setData({ ...data, email: e.target.value });

                if (errors.email) {
                  setErrors({ ...errors, email: "" });
                }

                setServerError("");
              }}
              placeholder="Enter your email"
              className="w-full border-2 rounded-lg p-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600"
            />
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
          </div>
          {errors.email && (
            <p className="mt-0.5 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col space-y-2 w-full mt-4">
          <label className="font-bold text-gray-700">Role</label>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`${role === "" ? "text-[#6b7280]" : "text-white"} w-full border-2 border-gray-600 rounded-lg p-2.5 pl-10 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent`}
            >
              {role || "Select Role of Member"}
              <MdBadge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
              <IoChevronDown
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-600 bg-black shadow-lg overflow-hidden">
                {RoleDropDown.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setRole(item.value);
                      setShowDropdown(false);

                      if (errors.role) {
                        setErrors({ ...errors, role: "" });
                      }

                      setServerError("");
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors cursor-pointer border-b border-gray-600 last:border-none"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.role && (
            <p className="mt-0.5 text-sm text-red-500">{errors.role}</p>
          )}
        </div>

        <div className="flex flex-col space-y-2 w-full mt-4">
          <label className="font-bold text-gray-700">Designation</label>
          <div className="relative">
            <input
              type="text"
              value={data.designation}
              onChange={(e) => {
                setData({ ...data, designation: e.target.value });
                setErrors({ ...errors, designation: "" });
                setServerError("");
              }}
              placeholder="Enter Designation of Member"
              className="w-full border-2 rounded-lg p-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600"
            />
            <FaUserTie className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
          </div>
          {errors.designation && (
            <p className="mt-0.5 text-sm text-red-500">{errors.designation}</p>
          )}
        </div>

        {success && (
          <div className="mb-4 mt-6 rounded-lg border border-green-600 bg-green-600/10 px-4 py-3 text-green-400 text-center">
            {success}
          </div>
        )}

        {serverError && (
          <div className="mt-6 rounded-lg border border-red-600 bg-red-600/10 px-4 py-3 text-center text-red-400">
            {serverError}
          </div>
        )}

        <div className="flex space-x-4 mt-8 my-2">
          <button
            onClick={() => {
              setShowInvite(!showInvite);
            }}
            className="w-full bg-gray-200 text-black px-4 py-3 rounded-md shadow-md hover:bg-gray-300 duration-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitBtn}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-md shadow-md hover:bg-green-700 duration-200 transition-colors cursor-pointer"
          >
            {loading ? "Sending Invite" : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
