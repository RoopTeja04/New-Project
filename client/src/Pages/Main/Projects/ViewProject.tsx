import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { FaProjectDiagram, FaExternalLinkAlt, FaTasks, FaEdit, FaTrash } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdKeyboardArrowLeft } from "react-icons/md";
import useProjectStore from "../../../stores/ProjectStores";
import useCompanyStore from "../../../stores/companyStores";
import useCompanyMembersStore from "../../../stores/companyMemberStores";

const ViewProject = () => {
  const navigate = useNavigate();
  const { projectID } = useLocation().state as { projectID: string };

  const { projectDetails, getProjectDetails } = useProjectStore();
  const { companyData } = useCompanyStore();
  const { members: companyMembers, getCompanyMembers } =
    useCompanyMembersStore();

  const [showOptions, setShowOptions] = useState(false);

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

  return (
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
            <h1 className="text-xl font-semibold text-white">{project.name}</h1>
            <p className="text-xs text-gray-400">
              Created on {dayjs(project.createdAt).format("MMMM D, YYYY")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {project.projectLink && (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300 hover:underline"
            >
              {project.projectLink}
              <FaExternalLinkAlt size={12} />
            </a>
          )}

          <button
            onClick={() => setShowOptions(!showOptions)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-600 transition hover:bg-gray-800 cursor-pointer"
          >
            <HiDotsVertical size={18} />
          </button>

          {showOptions && (
            <div className="absolute right-6 top-38 z-10 w-44 rounded-lg border border-gray-700 bg-[#071225] p-2 shadow-lg">
              <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-700 hover:text-white">
                <FaTasks className="text-blue-400" />
                <span>View Tasks</span>
              </button>

              <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-700 hover:text-white">
                <FaEdit className="text-yellow-400" />
                <span>Edit Project</span>
              </button>

              <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300">
                <FaTrash />
                <span>Delete Project</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-gray-700 bg-[#071225] p-5">
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
              {project.techStack.map((tech: string) => (
                <span
                  key={tech}
                  className="rounded-md bg-gray-800 px-3 py-1 text-xs text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex w-full flex-col gap-3 rounded-xl border border-gray-700 bg-[#071225] p-5 lg:w-1/2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Columns
            </h2>
            <span className="text-xs text-gray-500">
              Total: {projectDetails?.TotalColumns ?? columns.length}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {columns.map((column: any, index: number) => (
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

        <div className="flex w-full flex-col gap-3 rounded-xl border border-gray-700 bg-[#071225] p-5 lg:w-1/2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Project Members
            </h2>
            <span className="text-xs text-gray-500">
              Total: {projectDetails?.TotalMembers ?? members.length}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {members.map((member: any) => (
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProject;
