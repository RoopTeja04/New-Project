import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  FaProjectDiagram,
  FaExternalLinkAlt,
  FaTasks,
  FaEdit,
  FaTrash,
  FaRegCircle,
  FaPlay,
  FaSpinner,
  FaHourglassHalf,
  FaFlagCheckered,
  FaCheckCircle,
} from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowLeft } from "react-icons/md";
import useProjectStore from "../../../stores/ProjectStores";
import useCompanyStore from "../../../stores/companyStores";
import useCompanyMembersStore from "../../../stores/companyMemberStores";
import { DeleteProject, UpdateProjectStatus } from "../../../services/project";
import { RxCross2 } from "react-icons/rx";
import { DeleteProjectMemeber } from "../../../services/projectMember";
import { BsThreeDots } from "react-icons/bs";
import AddNewMember from "./AddNewMember";

const STATUS_LIST = [
  {
    name: "Not-Started",
    icon: FaRegCircle,
    badge: "bg-gray-500/10 text-gray-400",
    accent: "hover:border-gray-500",
  },
  {
    name: "Started",
    icon: FaPlay,
    badge: "bg-blue-500/10 text-blue-400",
    accent: "hover:border-blue-500",
  },
  {
    name: "In-Progress",
    icon: FaSpinner,
    badge: "bg-yellow-500/10 text-yellow-400",
    accent: "hover:border-yellow-500",
  },
  {
    name: "Almost Completed",
    icon: FaHourglassHalf,
    badge: "bg-orange-500/10 text-orange-400",
    accent: "hover:border-orange-500",
  },
  {
    name: "Final Stage",
    icon: FaFlagCheckered,
    badge: "bg-purple-500/10 text-purple-400",
    accent: "hover:border-purple-500",
  },
  {
    name: "Completed",
    icon: FaCheckCircle,
    badge: "bg-green-500/10 text-green-400",
    accent: "hover:border-green-500",
  },
];

const ViewProject = () => {
  const navigate = useNavigate();
  const { projectID } = useLocation().state as { projectID: string };

  const { projectDetails, getProjectDetails } = useProjectStore();
  const { companyData } = useCompanyStore();
  const { members: companyMembers, getCompanyMembers } =
    useCompanyMembersStore();

  const [showOptions, setShowOptions] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<boolean>(false);
  const [deleteMemberStatus, setDeleteMemberStatus] = useState<boolean>(false);
  const [addNewMember, setaddNewMember] = useState<boolean>(false);

  useEffect(() => {
    if (projectID) getProjectDetails(projectID);
  }, [projectID]);

  useEffect(() => {
    if (companyData?._id) getCompanyMembers(companyData._id);
  }, [companyData?._id]);

  const project = projectDetails?.project;

  const columns = [...(projectDetails?.columns || [])].sort(
    (a: any, b: any) => a.position - b.position,
  );

  const members = projectDetails?.members || [];

  const getDesignation = (userID: string) =>
    companyMembers.find((cm) => cm.userID?._id === userID)?.designation || "—";

  if (!project) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center px-6 py-6 text-gray-400">
        Loading project details...
      </div>
    );
  }

  const currentStatusName = selectedStatus ?? project.status;
  const currentStatusMeta =
    STATUS_LIST.find((s) => s.name === currentStatusName) || STATUS_LIST[0];
  const CurrentStatusIcon = currentStatusMeta.icon;

  const handleStatusChange = async (newStatus: string) => {
    const previousStatus = currentStatusName;
    setSelectedStatus(newStatus);
    setShowStatusMenu(false);

    try {
      const res = await UpdateProjectStatus(project._id, newStatus);
      toast.success(res.data?.message || "Project status updated successfully");
    } catch (err: any) {
      setSelectedStatus(previousStatus);
      toast.error(
        err.response?.data?.message || "Failed to update project status",
      );
    }
  };

  const handleDelete = (projectID: string) => async () => {
    setDeleteStatus(true);
    try {
      const res = await DeleteProject(projectID);
      toast.success(res.data.message || "Project deleted successfully");
      navigate("/dashboard/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setDeleteStatus(false);
    }
  };

  const handleDeleteProjectMember = async (
    memberID: string,
    projectID: string,
  ) => {
    setDeleteMemberStatus(true);
    try {
      const res = await DeleteProjectMemeber(memberID, projectID);
      toast.success(res.data.message || "Project member deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project member");
    } finally {
      setDeleteMemberStatus(false);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen flex flex-col space-y-6 px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex w-fit cursor-pointer items-center gap-1 rounded-lg border border-gray-600 px-2 py-1 hover:bg-gray-800 transition"
        >
          <MdKeyboardArrowLeft size={22} />
        </button>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-700 bg-[#071225] p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <FaProjectDiagram className="text-2xl text-blue-500" />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-white">
                {project.name}
              </h1>
              <p className="text-xs text-gray-400">
                Created on {dayjs(project.createdAt).format("MMMM D, YYYY")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStatusMenu((prev) => !prev)}
                onBlur={() => setTimeout(() => setShowStatusMenu(false), 150)}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border border-gray-700 bg-[#08162B] px-3 py-2 text-sm transition ${currentStatusMeta.accent}`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${currentStatusMeta.badge}`}
                >
                  <CurrentStatusIcon size={12} />
                </span>
                <span className="font-medium text-white">
                  {currentStatusName}
                </span>
                <IoIosArrowDown
                  className={`text-gray-400 transition-transform duration-200 ${
                    showStatusMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showStatusMenu && (
                <div className="absolute left-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-lg border border-gray-700 bg-[#071225] shadow-2xl">
                  {STATUS_LIST.map((item) => {
                    const Icon = item.icon;
                    const isSelected = item.name === currentStatusName;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onMouseDown={() => handleStatusChange(item.name)}
                        className={`flex w-full cursor-pointer items-center gap-2.5 border-b border-gray-800 px-3 py-2.5 text-left text-sm transition-colors last:border-none hover:bg-gray-800 ${
                          isSelected ? "bg-gray-800" : ""
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${item.badge}`}
                        >
                          <Icon size={12} />
                        </span>
                        <span className="text-gray-200">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {project.projectLink && (
              <a
                href={project.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300 hover:underline underline-offset-4"
              >
                Project Link <FaExternalLinkAlt size={12} />
              </a>
            )}

            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-600 transition hover:bg-gray-800 cursor-pointer"
            >
              <HiDotsVertical size={18} />
            </button>

            {showOptions && (
              <div className="absolute right-10 top-38 z-10 w-44 rounded-lg border border-gray-700 bg-[#071225] p-2 shadow-lg">
                <button
                  onClick={() => {
                    navigate("/dashboard/tasks-view-project", {
                      state: { projectID: project._id },
                    });
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-700 hover:text-white"
                >
                  <FaTasks className="text-blue-400" />
                  <span>View Tasks</span>
                </button>

                <button
                  onClick={() =>
                    navigate("/dashboard/update-project-details", {
                      state: { projectID: project._id },
                    })
                  }
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-700 hover:text-white"
                >
                  <FaEdit className="text-yellow-400" />
                  <span>Edit Project</span>
                </button>

                <button
                  onClick={handleDelete(projectID)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  {deleteStatus ? (
                    <>
                      {" "}
                      <FaTrash /> <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      <span>Delete Project</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 rounded-xl border border-gray-700 bg-[#071225] p-5">
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Description
            </h2>
            <p className="text-sm text-gray-300">{project.description}</p>
          </div>

          {project.techStack?.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.length === 0 ? (
                  <p>No tech stack specified</p>
                ) : (
                  project.techStack.map((tech: string) => (
                    <span
                      key={tech}
                      className="rounded-md bg-gray-800 px-3 py-1 text-xs text-gray-300"
                    >
                      {tech}
                    </span>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex w-full flex-col gap-3 h-80 rounded-xl border border-gray-700 bg-[#071225] p-5 lg:w-1/2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Columns
              </h2>
              <span className="text-xs text-gray-500">
                Total: {projectDetails?.TotalColumns ?? columns.length}
              </span>
            </div>

            <div className="flex flex-1 min-h-0 flex-col gap-2 overflow-y-auto scrollbar-hide">
              {columns.map((column: any) => (
                <div
                  key={column._id}
                  className="flex items-center gap-3 rounded-lg border border-gray-800 bg-[#08162B] px-4 py-2.5"
                >
                  <span className="text-sm font-semibold text-blue-400">
                    {column.position}.
                  </span>
                  <span className="text-sm text-white">{column.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 h-80 rounded-xl border border-gray-700 bg-[#071225] p-5 lg:w-1/2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Project Members
              </h2>
              <div className="flex items-center gap-2 space-x-2">
                <button
                  onClick={() => {
                    setaddNewMember(true);
                  }}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700 cursor-pointer"
                >
                  Add Member
                </button>
                <span className="text-xs text-gray-500">
                  Total: {projectDetails?.TotalMembers.length ?? members.length}
                </span>
              </div>
            </div>

            <div className="flex flex-1 min-h-0 flex-col gap-2 overflow-y-auto scrollbar-hide">
              {members.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-sm text-gray-400 text-center">
                    No members in this project.
                  </p>
                </div>
              ) : (
                members.map((member: any) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-3 rounded-lg border border-gray-800 bg-[#08162B] px-4 py-2.5"
                  >
                    {member.userID?.avatar ? (
                      <img
                        src={member.userID.avatar}
                        alt={member.userID.name}
                        className="h-9 w-9 rounded-full border border-slate-600 object-cover"
                      />
                    ) : (
                      <FaRegCircleUser className="h-9 w-9 text-gray-400" />
                    )}

                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {member.userID?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {getDesignation(member.userID?._id)}
                      </p>
                    </div>

                    <span className="rounded-md bg-blue-500/10 px-4 py-2 text-xs font-medium text-blue-400">
                      {member.role}
                    </span>

                    <button
                      onClick={() => {
                        handleDeleteProjectMember(member._id, projectID);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-600 transition hover:bg-gray-800 cursor-pointer"
                    >
                      {deleteMemberStatus ? <BsThreeDots /> : <RxCross2 />}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {addNewMember && (
        <AddNewMember
          setAddNewMember={setaddNewMember}
          projectID={projectID}
        />
      )}
    </>
  );
};

export default ViewProject;
