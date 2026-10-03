import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FaProjectDiagram, FaAlignLeft, FaCode, FaLink } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useProjectStore from "../../../stores/ProjectStores";

const UpdateProjectDetails = () => {
  const navigate = useNavigate();
  const { projectID } = useLocation().state as { projectID: string };

  const { projectDetails, getProjectDetails, updateProjectDetails, updating } =
    useProjectStore();

  const [errors, setErrors] = useState({ name: "", description: "" });
  const [Data, setData] = useState({
    name: "",
    description: "",
    techStack: [] as string[],
    projectLink: "",
  });
  const [techStackInput, setTechStackInput] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (projectID) getProjectDetails(projectID);
  }, [projectID]);

  useEffect(() => {
    const project = projectDetails?.project;

    if (project && !hydrated) {
      setData({
        name: project.name || "",
        description: project.description || "",
        techStack: project.techStack || [],
        projectLink: project.projectLink || "",
      });
      setTechStackInput((project.techStack || []).join(", "));
      setHydrated(true);
    }
  }, [projectDetails, hydrated]);

  const handleUpdate = async () => {
    const newErrors = { name: "", description: "" };

    if (!Data.name.trim()) {
      newErrors.name = "Project name is required.";
    }

    if (!Data.description.trim()) {
      newErrors.description = "Project description is required.";
    }

    setErrors(newErrors);

    if (newErrors.name || newErrors.description) return;

    try {
      const res = await updateProjectDetails(projectID, {
        name: Data.name,
        description: Data.description,
        techStack: Data.techStack,
        projectLink: Data.projectLink,
      });
      toast.success(
        res.data?.message || "Project Details Updated Successfully",
      );
      navigate("/dashboard/view-project", { state: { projectID } });
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    }
  };

  if (!hydrated) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center px-6 py-6 text-gray-400">
        Loading project details...
      </div>
    );
  }

  return (
    <div className="w-full px-7 py-8">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex w-fit cursor-pointer items-center gap-1 rounded-lg border border-gray-600 px-2 py-1 hover:bg-gray-800 transition"
        >
          <MdKeyboardArrowLeft size={22} />
        </button>

        <h1 className="text-xl font-semibold tracking-wide">Edit Project</h1>
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
                className="w-full rounded-xl border border-gray-600 bg-transparent py-3 pl-12 pr-4 resize-none outline-none focus:border-blue-500 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              />
            </div>
            {errors.description && (
              <p className="mt-0.5 text-sm text-red-500">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
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
        </div>
      </div>

      <div className="w-full flex items-center justify-end mt-10">
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="bg-green-700 px-6 py-2 rounded-md font-semibold tracking-wide hover:bg-green-600 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          {updating ? "Updating Project..." : "Update Project"}
        </button>
      </div>
    </div>
  );
};

export default UpdateProjectDetails;
