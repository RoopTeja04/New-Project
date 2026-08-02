import {
  FaRegCircle,
  FaPlay,
  FaSpinner,
  FaHourglassHalf,
  FaFlagCheckered,
  FaCheckCircle,
  FaProjectDiagram,
} from "react-icons/fa";
import useCompanyStore from "../../../stores/companyStores";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetStats } from "../../../services/company";
import Counter from "../../../Components/GlobalComponents/Counter";
import { FaFolderPlus } from "react-icons/fa";

const Projects = () => {
  const { companyData } = useCompanyStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState<any>([]);

  useEffect(() => {
    const companyId = companyData?._id;

    if (companyId) {
      getStats(companyId);
    }
  }, [companyData]);

  const getStats = async (id: string) => {
    try {
      const res = await GetStats(id);
      if (res.status === 200) setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen flex flex-col space-y-6 px-6 py-6">
        <div className="flex items-center justify-between pl-1 pr-4 mt-4">
          <h1 className="text-xl font-medium tracking-wide ml-4 mt-2">
            Monitor project progress, members, and workflows
          </h1>
          <button
            onClick={() => navigate("/dashboard/projects/add")}
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
              <h2 className="text-orange-400 font-semibold">
                Almost Completed
              </h2>
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
      </div>
    </>
  );
};

export default Projects;
