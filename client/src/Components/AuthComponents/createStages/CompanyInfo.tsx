import React from "react";
import { FaLink } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { Messages } from "primereact/messages";
import useAuthStore from "../../../stores/authStores";
import { useNavigate } from "react-router-dom";
const CompanyInfo = ({ setStage, stage, Data, setData }: any) => {
  const { createCompany } = useAuthStore();
  const navigate = useNavigate();

  const [error, setError] = React.useState<string>("");
  const msgs = React.useRef<Messages>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const handleSubmitBtn = async () => {
    if (!Data.website && !Data.designation) {
      setError("all");
      return;
    }
    if (!Data.website) {
      setError("website");
      return;
    }
    if (!Data.designation) {
      setError("designation");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const res = await createCompany(Data);

      if (res.status === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSubmitting(false);
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      const backendError =
        err.response?.data?.message ||
        "Something went wrong. Please try again later!";
      msgs.current?.show({
        severity: "error",
        summary: "Error",
        detail: backendError,
      });
    }
  };

  return (
    <div className="flex-1 w-full my-2 space-y-5 pr-20">
      <Messages ref={msgs} />
      {/* {isSubmitting && ( */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm h-full">
          <div className="bg-white/90 backdrop-blur-xl  shadow-2xl rounded-2xl w-full max-w-md">
            {!isSuccess ? (
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
                  <i
                    className="pi pi-spinner pi-spin text-blue-500"
                    style={{ fontSize: "2.5rem" }}
                  />
                </div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Creating Your Workspace
                </h2>

                <p className="text-gray-500 mt-2 mb-6">
                  Please wait while we set everything up for you.
                </p>

                <div className="w-full max-w-sm space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <i className="pi pi-check-circle text-green-500 text-lg"></i>
                    <span className="text-gray-700">Account Created</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <i className="pi pi-check-circle text-green-500 text-lg"></i>
                    <span className="text-gray-700">Company Created</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <i className="pi pi-spinner pi-spin text-blue-500 text-lg"></i>
                    <span className="text-gray-700">Setting Up Workspace...</span>
                  </div>
                </div>

                <div className="w-full max-w-sm mt-6">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse w-full"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
                  <i
                    className="pi pi-check-circle text-green-500"
                    style={{ fontSize: "2.5rem" }}
                  />
                </div>

                <h2 className="text-xl font-semibold text-green-600">
                  Setup Complete
                </h2>

                <p className="text-gray-500 mt-2 mb-6">
                  Your account and company have been created successfully.
                </p>

                <div className="w-full max-w-sm space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <i className="pi pi-check-circle text-green-500 text-lg"></i>
                    <span className="text-gray-700">Account Created</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <i className="pi pi-check-circle text-green-500 text-lg"></i>
                    <span className="text-gray-700">Company Created</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <i className="pi pi-check-circle text-green-500 text-lg"></i>
                    <span className="text-gray-700">Workspace Ready</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      {/* )} */}
      <div className="flex flex-col space-y-2 w-full">
        <label className="font-bold text-gray-700">Website</label>
        <div className="relative">
          <input
            type="text"
            value={Data.website}
            className={`${error === "website" || error === "all" ? "border-red-500" : "border-gray-300"} w-full border-2 border-gray-300 rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Company Website"
            onChange={(e) => {
              setData({ ...Data, website: e.target.value });
              if (error === "website" || error === "all") setError("");
            }}
          />
          <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
        </div>
        {(error === "website" || error === "all") && (
          <p className="text-red-500 font-medium text-sm">
            Website is required
          </p>
        )}
      </div>

      <div className="flex flex-col space-y-2 w-full">
        <label className="font-bold text-gray-700">Designation</label>
        <div className="relative">
          <input
            type="text"
            value={Data.designation}
            className={`${error === "designation" || error === "all" ? "border-red-500" : "border-gray-300"} w-full border-2 border-gray-300 rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter Designation"
            onChange={(e) => {
              setData({ ...Data, designation: e.target.value });
              if (error === "designation" || error === "all") setError("");
            }}
          />
          <MdWork className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
        </div>
        {(error === "designation" || error === "all") && (
          <p className="text-red-500 font-medium text-sm">
            Designation is required
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
          onClick={handleSubmitBtn}
          className="w-[30%] bg-blue-700 text-white font-medium tracking-[0.7px] rounded-lg p-2.5 cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CompanyInfo;
