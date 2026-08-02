import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import {
  FaProjectDiagram,
  FaAlignLeft,
  FaCode,
  FaLink,
  FaUsers,
} from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";

const AddProjects = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    name: "",
    description: "",
    techStack: "",
    projectLink: "",
    projectMembersData: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    techStack: "",
    projectLink: "",
    projectMembersData: "",
  });

  const validateStepOne = () => {
    let valid = true;
    const newErrors: any = {};

    if (!data.name.trim()) {
      newErrors.name = "Project name is required";
      valid = false;
    }

    if (!data.description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    }

    if (!data.techStack.trim()) {
      newErrors.techStack = "Tech stack is required";
      valid = false;
    }

    setErrors({ ...errors, ...newErrors });

    if (valid) {
      setStep(2);
    }
  };

  const handleSubmit = () => {
    const newErrors: any = {};

    if (!data.projectMembersData.trim()) {
      newErrors.projectMembersData = "Members are required";
      setErrors({ ...errors, ...newErrors });
      return;
    }

    console.log({
      name: data.name,
      description: data.description,
      techStack: data.techStack.split(",").map((item) => item.trim()),
      projectLink: data.projectLink,
      projectMembersData: data.projectMembersData
        .split(",")
        .map((item) => item.trim()),
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col px-6 py-6 bg-[#000d24]">
      <div className="w-full flex-col">

        <div className="flex items-center space-x-4 px-7 py-5">
          <button
            onClick={() => navigate(-1)}
            className="border border-gray-500 px-2 py-1 rounded-lg"
          >
            <MdKeyboardArrowLeft size={26} />
          </button>

          <h1 className="text-3xl font-bold text-white">Create Project</h1>
        </div>

        {/* Scrollable Body */}

        <div className="flex-1 overflow-y-auto px-8 py-7 scrollbar-hide">
          {/* Steps */}

          <div className="mb-14 flex items-center justify-center">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full font-bold transition-all ${
                step >= 1 ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
              }`}
            >
              1
            </div>

            <div className="mx-5 h-[2px] w-36 bg-gray-700"></div>

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full font-bold transition-all ${
                step === 2 ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
              }`}
            >
              2
            </div>
          </div>

          {/* ============================= */}
          {/* STEP - 1 */}
          {/* ============================= */}

          {step === 1 && (
            <div className="space-y-7">
              {/* Project Name */}

              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-300">
                  Project Name
                </label>

                <div className="relative">
                  <input
                    className="w-full rounded-lg border-2 border-gray-700 bg-transparent py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"
                    placeholder="Enter project name"
                  />

                  <FaProjectDiagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>

                <p className="text-sm text-red-500">{/* Error */}</p>
              </div>

              {/* Description */}

              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-300">
                  Description
                </label>

                <div className="relative">
                  <textarea
                    rows={6}
                    className="w-full resize-none rounded-lg border-2 border-gray-700 bg-transparent py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"
                    placeholder="Enter project description..."
                  />

                  <FaAlignLeft className="absolute left-4 top-5 text-gray-500" />
                </div>

                <p className="text-sm text-red-500"></p>
              </div>

              {/* Tech Stack */}

              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-300">
                  Tech Stack
                </label>

                <div className="relative">
                  <input
                    className="w-full rounded-lg border-2 border-gray-700 bg-transparent py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"
                    placeholder="React, Node.js, MongoDB..."
                  />

                  <FaCode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>

                <p className="text-sm text-red-500"></p>
              </div>

              {/* Project Link */}

              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-300">
                  Project Link
                </label>

                <div className="relative">
                  <input
                    className="w-full rounded-lg border-2 border-gray-700 bg-transparent py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"
                    placeholder="https://example.com"
                  />

                  <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>

                <p className="text-sm text-red-500"></p>
              </div>
            </div>
          )}

          {/* ============================= */}
          {/* STEP - 2 */}
          {/* ============================= */}

          {step === 2 && (
            <div className="space-y-7">
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-300">
                  Project Members
                </label>

                <div className="relative">
                  <input
                    className="w-full rounded-lg border-2 border-gray-700 bg-transparent py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"
                    placeholder="Search team members..."
                  />

                  <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>

                <p className="text-sm text-red-500"></p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="flex items-center justify-between border-t border-gray-700 bg-[#08111F] px-8 py-5">
          <div>
            {step === 2 && (
              <button className="rounded-lg border border-gray-600 px-6 py-3 text-white transition hover:bg-gray-700">
                Back
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate("/dashboard/projects")}>
              Cancel
            </button>

            {step === 1 ? (
              <button
                onClick={validateStepOne}
                className="rounded-lg bg-blue-600 px-7 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-green-600 px-7 py-3 font-medium text-white transition hover:bg-green-700"
              >
                Create Project
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjects;
