import React, { useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import {
  FaProjectDiagram,
  FaAlignLeft,
  FaCode,
  FaLink,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useCompanyStore from "../../../stores/companyStores";
import useAuthStore from "../../../stores/authStores";

const AddProjects = () => {
  const navigate = useNavigate();

  const { companyData } = useCompanyStore();
  const { userId } = useAuthStore();

  const defaultValues = {
    companyId: companyData?._id,
    ownerId: userId,
    name: "",
    description: "",
    techStack: [] as string[],
    projectLink: "",
    projectMembersData: [] as string[],
  };

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    projectMembersData: [],
  });

  const [Data, setData] = useState(defaultValues);

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
              <p className="mt-0.5 text-sm text-red-500">{errors.description}</p>
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
                value={Data.techStack[0]}
                onChange={(e) => {
                  const techStack = e.target.value.split(",").map((tech) => tech.trim());
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
                value={Data.projectMembersData.join(", ")}
                onChange={(e) => {
                  const members = e.target.value.split(",").map((member) => member.trim());
                  setData({ ...Data, projectMembersData: members });
                  if (errors.projectMembersData.length > 0) {
                    setErrors({ ...errors, projectMembersData: [] });
                  }
                }}
                placeholder="Select project members"
                className="w-full rounded-xl border border-gray-600 bg-transparent py-3 pl-12 pr-4 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-end mt-10">
        <button className="bg-green-700 px-6 py-2 rounded-md font-semibold tracking-wide hover:bg-green-600 transition-all duration-300 cursor-pointer">
          Create Workspace
        </button>
      </div>
    </div>
  );
};

export default AddProjects;
