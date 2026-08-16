import { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { IoCheckmark, IoChevronDown, IoClose } from "react-icons/io5";
import useCompanyMembersStore from "../../../stores/companyMemberStores";
import { MdBadge } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useProjectMemberStore from "../../../stores/ProjectMembersStroes";

const AddNewMember = ({ projectID, setAddNewMember }: any) => {
  const navigate = useNavigate();
  const { members } = useCompanyMembersStore();
  const { addProjectMember } = useProjectMemberStore();

  const roles = [
    "Designer",
    "Developer",
    "SEO Manager",
    "Business Analyst",
    "Spectator",
  ];

  const [search, setSearch] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showMemberDropdown, setShowMemberDropdown] = useState<boolean>(false);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const filteredMembers = members.filter((member: any) =>
    member.userID?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedMemberData = members.find(
    (member: any) => member.userID?._id === selectedMember,
  );

  const handleSelectedMember = (userID: string) => {
    setSelectedMember(userID);
    setShowMemberDropdown(false);
    setSearch("");
  };

  const handleAddNewMember = async () => {
    if (!selectedMember || !role) {
      toast.error("Please select a member and a role.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userID: selectedMember,
        role,
        projectID,
      };

      const res = await addProjectMember(payload);
      toast.success(res?.data?.message || "Project Member Added Successfully");
      setAddNewMember(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-gray-700 bg-[#08111F] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-6 flex items-center justify-between border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-semibold text-white">Add New Member</h2>

          <button
            onClick={() => setAddNewMember(false)}
            className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-gray-700 hover:text-white"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="mt-4 flex w-full flex-col space-y-2">
          <label className="font-bold text-gray-300">Search Member</label>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowMemberDropdown(!showMemberDropdown);
                setShowDropDown(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl border bg-transparent px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedMember
                  ? "border-blue-500/60 text-white"
                  : "border-gray-600 text-gray-400"
              }`}
            >
              <span className="flex items-center gap-2">
                <IoMdSearch className="text-lg text-gray-400" />

                <span>
                  {selectedMemberData?.userID?.name ||
                    "Search and select member"}
                </span>
              </span>

              <IoChevronDown
                className={`transition-transform duration-200 ${
                  showMemberDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showMemberDropdown && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-gray-600 bg-[#0D1B2A] shadow-2xl">
                <div className="border-b border-gray-700 p-3">
                  <div className="relative">
                    <IoMdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by member name..."
                      autoFocus
                      className="w-full rounded-lg border border-gray-600 bg-[#08111F] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="max-h-52 overflow-y-auto">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member: any) => {
                      const memberID = member.userID?._id;

                      const isSelected = selectedMember === memberID;

                      return (
                        <button
                          key={member._id}
                          type="button"
                          onClick={() => handleSelectedMember(memberID)}
                          className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm transition ${
                            isSelected
                              ? "bg-blue-500/10 text-blue-300"
                              : "text-gray-300 hover:bg-gray-800"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            {member.userID?.avatar ? (
                              <img
                                src={member.userID.avatar}
                                alt={member.userID?.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-xs font-semibold text-blue-400">
                                {member.userID?.name?.charAt(0)?.toUpperCase()}
                              </div>
                            )}

                            <span>{member.userID?.name}</span>
                          </span>

                          {isSelected && (
                            <IoCheckmark size={18} className="text-blue-400" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                      <IoMdSearch className="mb-3 text-3xl text-gray-500" />

                      <p className="text-sm font-medium text-white">
                        No member found
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        No member found under this name.
                      </p>

                      <button
                        type="button"
                        className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 cursor-pointer"
                        onClick={() => navigate("/dashboard/invites")}
                      >
                        Invite Member
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex w-full flex-col space-y-2">
          <label className="font-bold text-gray-300">Role</label>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowDropDown(!showDropDown);
                setShowMemberDropdown(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl border bg-transparent px-3 py-3 pl-4 pr-3 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                role
                  ? "border-blue-500/60 text-white"
                  : "border-gray-600 text-gray-400"
              }`}
            >
              <span className="flex items-center gap-2">
                <MdBadge className="text-gray-400" />

                <span>{role || "Select Role"}</span>
              </span>

              <IoChevronDown
                className={`transition-transform duration-200 ${
                  showDropDown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropDown && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-48 overflow-y-auto rounded-xl border border-gray-600 bg-[#0D1B2A] shadow-2xl">
                {roles.map((item) => {
                  const isSelected = role === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm transition ${
                        isSelected
                          ? "bg-blue-500/10 text-blue-300"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                      onClick={() => {
                        setRole(item);
                        setShowDropDown(false);
                      }}
                    >
                      <span>{item}</span>

                      {isSelected && (
                        <IoCheckmark size={18} className="text-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-gray-700 pt-4">
          <button
            type="button"
            onClick={() => setAddNewMember(false)}
            className="cursor-pointer rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!selectedMember || !role || loading}
            onClick={handleAddNewMember}
            className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewMember;
