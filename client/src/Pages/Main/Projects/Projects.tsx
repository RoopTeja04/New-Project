import {
  FaRegCircle,
  FaPlay,
  FaSpinner,
  FaHourglassHalf,
  FaFlagCheckered,
  FaCheckCircle,
  FaProjectDiagram,
} from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import useCompanyStore from "../../../stores/companyStores";
import useProjectStore from "../../../stores/ProjectStores";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Counter from "../../../Components/GlobalComponents/Counter";
import { FaFolderPlus } from "react-icons/fa";

const STATUS_STYLES: Record<string, string> = {
  "Not-Started": "bg-gray-500/10 text-gray-400",
  Started: "bg-blue-500/10 text-blue-400",
  "In-Progress": "bg-yellow-500/10 text-yellow-400",
  "Almost Completed": "bg-orange-500/10 text-orange-400",
  "Final Stage": "bg-purple-500/10 text-purple-400",
  Completed: "bg-green-500/10 text-green-400",
};

const Projects = () => {
  const { companyData } = useCompanyStore();
  const { stats, getProjectStats, getProjectByCompany, projects } =
    useProjectStore();
  const navigate = useNavigate();

  useEffect(() => {
    const companyId = companyData?._id;

    if (companyId) {
      getProjectStats(companyId).catch((err) => console.error(err));
      getProjectByCompany(companyId).catch((err) => console.error(err));
    }
  }, [companyData]);

  return (
    <div className="w-full min-h-screen flex flex-col space-y-6 px-6 py-6">
      <div className="flex items-center justify-between pl-1 pr-4 mt-4">
        <h1 className="text-xl font-medium tracking-wide ml-4 mt-2">
          Monitor project progress, members, and workflows
        </h1>
        <button
          onClick={() => navigate("/dashboard/add-projects")}
          className="px-5 py-2 bg-green-600 rounded-lg tracking-wide flex items-center space-x-2 cursor-pointer"
        >
          <FaFolderPlus />
          <p className="font-medium">Create Project</p>
        </button>
      </div>

      <div className="flex flex-wrap gap-5 px-3 py-2">
        <div className="min-w-45 flex-1 h-44 rounded-xl border border-gray-700 bg-[#071225] p-5 flex flex-col">
          <div className="flex items-center gap-3">
            <FaProjectDiagram className="text-xl text-blue-500" />
            <h2 className="text-blue-400 font-semibold">Total Projects</h2>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="flex-1 flex items-center justify-center">
              <Counter value={stats?.totalProjects || 0} />
            </div>
          </div>
        </div>

        <div className="min-w-45 flex-1 h-44 rounded-xl border border-gray-700 bg-[#071225] p-5 flex flex-col">
          <div className="flex items-center gap-3">
            <FaRegCircle className="text-xl text-gray-400" />
            <h2 className="text-gray-400 font-semibold">Not Started</h2>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-6xl font-bold text-white">
              <Counter value={stats?.notStartedProjects || 0} />
            </h1>
          </div>
        </div>

        <div className="min-w-45 flex-1 h-44 rounded-xl border border-gray-700 bg-[#071225] p-5 flex flex-col">
          <div className="flex items-center gap-3">
            <FaPlay className="text-xl text-blue-500" />
            <h2 className="text-blue-400 font-semibold">Started</h2>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-6xl font-bold text-white">
              <Counter value={stats?.startedProjects || 0} />
            </h1>
          </div>
        </div>

        <div className="min-w-45 flex-1 h-44 rounded-xl border border-gray-700 bg-[#071225] p-5 flex flex-col">
          <div className="flex items-center gap-3">
            <FaSpinner className="text-xl text-yellow-500 " />
            <h2 className="text-yellow-400 font-semibold">In Progress</h2>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-6xl font-bold text-white">
              <Counter value={stats?.inprogressProjects || 0} />
            </h1>
          </div>
        </div>

        <div className="min-w-45 flex-1 h-44 rounded-xl border border-gray-700 bg-[#071225] p-5 flex flex-col">
          <div className="flex items-center gap-3">
            <FaHourglassHalf className="text-xl text-orange-500" />
            <h2 className="text-orange-400 font-semibold">Almost Completed</h2>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-6xl font-bold text-white">
              <Counter value={stats?.almostCompletedProjects || 0} />
            </h1>
          </div>
        </div>

        <div className="min-w-45 flex-1 h-44 rounded-xl border border-gray-700 bg-[#071225] p-5 flex flex-col">
          <div className="flex items-center gap-3">
            <FaFlagCheckered className="text-xl text-purple-500" />
            <h2 className="text-purple-400 font-semibold">Final Stage</h2>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-6xl font-bold text-white">
              <Counter value={stats?.finalStageProjects || 0} />
            </h1>
          </div>
        </div>

        <div className="min-w-45 flex-1 h-44 rounded-xl border border-gray-700 bg-[#071225] p-5 flex flex-col">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-xl text-green-500" />
            <h2 className="text-green-400 font-semibold">Completed</h2>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-6xl font-bold text-white">
              <Counter value={stats?.completedProjects || 0} />
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-6 pl-4 pr-2">
        <div className="flex items-center justify-between pl-1 pr-4">
          <h2 className="pl-1 text-lg font-semibold tracking-wide">
            All Projects
          </h2>

          <span>
            {projects.length} project{projects.length !== 1 && "s"}
          </span>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="flex cursor-pointer select-none flex-col gap-3 rounded-xl border border-gray-700 bg-[#071225] p-5 transition hover:border-blue-500"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate text-lg font-semibold text-white hover:underline hover:underline-offset-4">
                    {project.name}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                      STATUS_STYLES[project.status] ||
                      "bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="line-clamp-2 text-sm text-gray-400">
                  {project.description}
                </p>

                {project.techStack?.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {project.techStack.map((tech: string) => (
                      <span
                        key={tech}
                        className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-2 flex items-center gap-2 border-t border-gray-800 pt-3">
                  <FaRegCircleUser className="text-gray-500" />
                  <span className="text-xs text-gray-400">
                    {project.ownerID?.name || "Unknown Owner"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-700 py-14 text-center text-gray-400">
            No projects yet. Create your first project to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
