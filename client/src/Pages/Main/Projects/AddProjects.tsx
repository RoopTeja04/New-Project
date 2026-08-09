import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import {
  FaProjectDiagram,
  FaAlignLeft,
  FaCode,
  FaLink,
  FaUsers,
} from "react-icons/fa";
import { IoClose, IoChevronDown } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { FaRegCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useCompanyStore from "../../../stores/companyStores";
import useAuthStore from "../../../stores/authStores";
import useCompanyMembersStore from "../../../stores/companyMemberStores";
import useProjectStore from "../../../stores/ProjectStores";

const ROLE_OPTIONS = [
  "Designer",
  "Developer",
  "SEO Manager",
  "Business Analyst",
  "Spectator",
];

interface SelectedMember {
  userID: string;
  name: string;
  email: string;
  role: string;
}

const AddProjects = () => {
  const navigate = useNavigate();

  const { companyData } = useCompanyStore();
  const { userId } = useAuthStore();
  const { members, getCompanyMembers } = useCompanyMembersStore();
  const { createProject, creating } = useProjectStore();

  const defaultValues = {
    name: "",
    description: "",
    techStack: [] as string[],
    projectLink: "",
  };

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    projectMembersData: "",
  });

  const [Data, setData] = useState(defaultValues);
  const [techStackInput, setTechStackInput] = useState("");

  const [memberSearch, setMemberSearch] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
  const [openRoleDropdownFor, setOpenRoleDropdownFor] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (companyData?._id) {
      getCompanyMembers(companyData._id);
    }
  }, [companyData?._id]);

  const filteredMembers = memberSearch.trim()
    ? members.filter(
        (member) =>
          member.userID?.name
            ?.toLowerCase()
            .includes(memberSearch.trim().toLowerCase()) &&
          !selectedMembers.some((sm) => sm.userID === member.userID?._id),
      )
    : [];

  const handleAddMember = (member: (typeof members)[number]) => {
    setSelectedMembers((prev) => [
      ...prev,
      {
        userID: member.userID._id,
        name: member.userID.name,
        email: member.userID.email,
        role: "",
      },
    ]);
    setMemberSearch("");
    setShowMemberDropdown(false);
    setErrors((prev) => ({ ...prev, projectMembersData: "" }));
  };

  const handleRemoveMember = (userID: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.userID !== userID));
  };

  const handleRoleChange = (userID: string, role: string) => {
    setSelectedMembers((prev) =>
      prev.map((m) => (m.userID === userID ? { ...m, role } : m)),
    );
    setErrors((prev) => ({ ...prev, projectMembersData: "" }));
  };

  const handleCreateWorkspace = async () => {
    const newErrors = { name: "", description: "", projectMembersData: "" };

    if (!Data.name.trim()) {
      newErrors.name = "Project name is required.";
    }

    if (!Data.description.trim()) {
      newErrors.description = "Project description is required.";
    }

    if (selectedMembers.some((m) => !m.role)) {
      newErrors.projectMembersData =
        "Please select a role for every added member.";
    }

    setErrors(newErrors);

    if (newErrors.name || newErrors.description || newErrors.projectMembersData)
      return;

    const payload = {
      companyID: companyData?._id,
      ownerID: userId,
      name: Data.name,
      description: Data.description,
      techStack: Data.techStack,
      projectLink: Data.projectLink,
      projectMembersData: selectedMembers.map((m) => ({
        userID: m.userID,
        role: m.role,
      })),
    };

    try {
      const res = await createProject(payload);
      toast.success(res.data?.message || "Project Created Successfully");
      navigate("/dashboard/projects");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full px-7 py-8">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="border border-gray-600 px-2 py-1 rounded-lg hover:bg-gray-800 transition"
        >
          <MdKeyboardArrowLeft size={26} />
        </button>

        <h1 className="text-xl font-semibold tracking-wide">Create Project</h1>
      </div>

      <div className="grid grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-300">
              Project Name
            </label>

            <div className="relative">
              <FaProjectDiagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                type="text"
                value={Data.name}
                onChange={(e) => {
                  setData({ ...Data, name: e.target.value });
                  if (errors.name) {
                    setErrors({ ...errors, name: "" });
                  }
                }}
                placeholder="Enter project name"
                className="w-full rounded-xl border border-gray-600 bg-transparent py-3 pl-12 pr-4 outline-none focus:border-blue-500"
              />
            </div>
            {errors.name && (
              <p className="mt-0.5 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-300">
              Description
            </label>

            <div className="relative">
              <FaAlignLeft className="absolute left-4 top-5 text-gray-500" />

              <textarea
                rows={6}
                value={Data.description}
                onChange={(e) => {
                  setData({ ...Data, description: e.target.value });
                  if (errors.description) {
                    setErrors({ ...errors, description: "" });
                  }
                }}
                placeholder="Enter project description"
                className="w-full rounded-xl border border-gray-600 bg-transparent py-3 pl-12 pr-4 resize-none outline-none focus:border-blue-500"
              />
            </div>
            {errors.description && (
              <p className="mt-0.5 text-sm text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-300">
              Tech Stack
            </label>

            <div className="relative">
              <FaCode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                type="text"
                value={techStackInput}
                onChange={(e) => {
                  setTechStackInput(e.target.value);
                  const techStack = e.target.value
                    .split(",")
                    .map((tech) => tech.trim())
                    .filter(Boolean);
                  setData({ ...Data, techStack });
                }}
                placeholder="React, Node.js, MongoDB..."
                className="w-full rounded-xl border border-gray-600 bg-transparent py-3 pl-12 pr-4 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-300">
              Project Link
            </label>

            <div className="relative">
              <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                type="url"
                value={Data.projectLink}
                onChange={(e) => {
                  setData({ ...Data, projectLink: e.target.value });
                }}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-gray-600 bg-transparent py-3 pl-12 pr-4 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-300">
              Project Members
            </label>

            <div className="relative">
              <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                type="text"
                value={memberSearch}
                onChange={(e) => {
                  setMemberSearch(e.target.value);
                  setShowMemberDropdown(true);
                }}
                onFocus={() => setShowMemberDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowMemberDropdown(false), 150)
                }
                placeholder="Search employee by name"
                className="w-full rounded-xl border border-gray-600 bg-transparent py-3 pl-12 pr-4 outline-none focus:border-blue-500"
              />

              {showMemberDropdown && memberSearch.trim() && (
                <div className="absolute z-20 mt-2 w-full max-h-56 overflow-y-auto rounded-lg border border-gray-600 bg-black shadow-lg">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <button
                        key={member._id}
                        type="button"
                        onMouseDown={() => handleAddMember(member)}
                        className="flex w-full cursor-pointer items-center gap-3 border-b border-gray-700 px-4 py-3 text-left transition-colors last:border-none hover:bg-gray-800"
                      >
                        {member.userID?.avatar ? (
                          <img
                            src={member.userID.avatar}
                            alt={member.userID.name}
                            className="h-9 w-9 rounded-full object-cover border border-slate-600"
                          />
                        ) : (
                          <FaRegCircleUser className="h-9 w-9 text-gray-400" />
                        )}

                        <div>
                          <p className="font-medium">{member.userID?.name}</p>
                          <p className="text-xs text-gray-400">
                            {member.designation}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="space-y-2 px-4 py-4 text-center">
                      <p className="text-sm text-gray-400">
                        Employee not found under this name.
                      </p>
                      <button
                        type="button"
                        onMouseDown={() => navigate("/dashboard/invites")}
                        className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-green-500 hover:text-green-400"
                      >
                        <IoIosPersonAdd /> Invite New Member
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedMembers.length > 0 && (
              <div className="mt-4 space-y-3">
                {selectedMembers.map((member) => (
                  <div
                    key={member.userID}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-700 bg-[#08162B] px-4 py-2.5"
                  >
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenRoleDropdownFor((prev) =>
                              prev === member.userID ? null : member.userID,
                            )
                          }
                          onBlur={() =>
                            setTimeout(
                              () =>
                                setOpenRoleDropdownFor((prev) =>
                                  prev === member.userID ? null : prev,
                                ),
                              150,
                            )
                          }
                          className={`flex w-40 cursor-pointer items-center justify-between gap-2 rounded-md border border-gray-600 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-blue-500 ${
                            member.role ? "text-white" : "text-gray-500"
                          }`}
                        >
                          <span>{member.role || "Select role"}</span>
                          <IoChevronDown
                            className={`transition-transform ${
                              openRoleDropdownFor === member.userID
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>

                        {openRoleDropdownFor === member.userID && (
                          <div className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-lg border border-gray-600 bg-black shadow-lg">
                            {ROLE_OPTIONS.map((role) => (
                              <button
                                key={role}
                                type="button"
                                onMouseDown={() => {
                                  handleRoleChange(member.userID, role);
                                  setOpenRoleDropdownFor(null);
                                }}
                                className="w-full cursor-pointer border-b border-gray-700 px-4 py-2.5 text-left text-sm transition-colors last:border-none hover:bg-gray-800"
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.userID)}
                        className="cursor-pointer text-gray-400 transition hover:text-red-500"
                      >
                        <IoClose size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errors.projectMembersData && (
              <p className="mt-0.5 text-sm text-red-500">
                {errors.projectMembersData}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-end mt-10">
        <button
          onClick={handleCreateWorkspace}
          disabled={creating}
          className="bg-green-700 px-6 py-2 rounded-md font-semibold tracking-wide hover:bg-green-600 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creating ? "Creating Workspace..." : "Create Workspace"}
        </button>
      </div>
    </div>
  );
};

export default AddProjects;
