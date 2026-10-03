import React from "react";
import { MdBusiness } from "react-icons/md";

const CompanyDetails = ({ setStage, stage, Data, setData }: any) => {
  const [error, setError] = React.useState<string>("");

  const handleNextBtn = () => {
    if (!Data.companyName && !Data.description) {
      setError("all");
      return;
    }
    if (!Data.companyName.trim()) {
      setError("companyName");
      return;
    }

    if (Data.companyName.trim().length < 3) {
      setError("companyNameLength");
      return;
    }

    if (!Data.description.trim()) {
      setError("description");
      return;
    }

    if (Data.description.trim().length < 20) {
      setError("descriptionLength");
      return;
    }

    setError("");
    setStage(stage + 1);
  };

  return (
    <div className="flex-1 w-full my-2 space-y-5 pr-20">
      <div className="flex flex-col space-y-2 w-full">
        <label className="font-bold text-gray-700">Company Name</label>
        <div className="relative">
          <input
            type="text"
            value={Data.companyName}
            className={`${error === "companyName" || error === "all" ? "border-red-500" : "border-gray-300"} w-full border-2 border-gray-300 rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter Company Name"
            onChange={(e) => {
              setData({ ...Data, companyName: e.target.value });
              if (error === "companyName" || error === "all") setError("");
            }}
          />
          <MdBusiness className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
        </div>
        {(error === "companyName" || error === "all") && (
          <p className="text-red-500 font-medium text-sm">
            Company Name is required
          </p>
        )}
        {error === "companyNameLength" && (
          <p className="text-red-500 font-medium text-sm">
            Company Name must be at least 3 characters long
          </p>
        )}
      </div>

      <div className="flex flex-col space-y-2 w-full">
        <label className="font-bold text-gray-700">Description</label>
        <div className="">
          <textarea
            rows={3}
            value={Data.description}
            className={`${error === "description" || error === "all" ? "border-red-500" : "border-gray-300"} w-full border-2 border-gray-300 h-30 resize-none rounded-lg p-2 pl-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter Company Description"
            onChange={(e) => {
              setData({ ...Data, description: e.target.value });
              if (error === "description" || error === "all") setError("");
            }}
          />
        </div>
        {(error === "description" || error === "all") && (
          <p className="text-red-500 font-medium text-sm">
            Description is required
          </p>
        )}
        {error === "descriptionLength" && (
          <p className="text-red-500 font-medium text-sm">
            Description must be at least 20 characters long
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-7">
        <button
          onClick={() => setStage(stage - 1)}
          className="w-[30%] bg-white border-2 border-gray-300 rounded-lg p-2.5"
        >
          Previous
        </button>
        <button
          onClick={handleNextBtn}
          className="w-[30%] bg-blue-700 text-white rounded-lg p-2.5 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompanyDetails;
