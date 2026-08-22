import { useState } from "react";
import { CgOrganisation } from "react-icons/cg";
import useCompanyStore from "../../../stores/companyStores";
import { MdDeleteForever, MdOutlineCalendarToday } from "react-icons/md";
import dayjs from "dayjs";
import { TfiWorld } from "react-icons/tfi";
import { CiEdit } from "react-icons/ci";
import EditCompanyDetails from "./EditCompanyDetails";

const Company = () => {
  const { companyData } = useCompanyStore();
  const [showEditDetails, setShowEditDetails] = useState(false);

  return (
    <>
      <div className="flex flex-col space-y-4 p-4 my-6 mx-6">
        <div className="border-[#2e3b51] border-2 rounded-lg p-8 flex items-center justify-between">
          <div className="flex space-x-4 items-center">
            <CgOrganisation
              size={80}
              className="border-[#2e3b51] border-2 p-3 rounded-lg"
            />
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <h1 className="font-semibold text-[22px] tracking-wide">
                  {companyData?.companyName}
                </h1>
                <span
                  className={`${companyData?.isActive ? "bg-green-600" : "bg-red-500 "} px-6 py-1 text-sm tracking-wide rounded-2xl`}
                >
                  {companyData?.isActive ? "Active" : "InActive"}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <MdOutlineCalendarToday className="text-gray-400 text-sm" />
                  <span className="text-gray-400 text-sm">
                    Created{" "}
                    {companyData?.createdAt
                      ? dayjs(companyData.createdAt).format("MMMM D, YYYY")
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TfiWorld className="text-gray-400 text-sm" />
                  <a
                    href={companyData?.website}
                    className={`${companyData?.website ? "text-blue-400" : "text-gray-400"} "text-sm"`}
                  >
                    {companyData?.website}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => setShowEditDetails(true)}
              className="border-[#2e3b51] border-2 rounded-lg px-4 py-2 flex items-center space-x-3 cursor-pointer"
            >
              <CiEdit />
              <p className="text-base font-medium">Edit Details</p>
            </button>
          </div>
        </div>

        <div className="flex items-stretch space-x-6">
          <div className="flex w-[50%] flex-col border-[#2e3b51] border-2 rounded-md px-4 py-2">
            <h1 className="text-lg font-medium tracking-wide p-2">
              Company Description
            </h1>
            <span className="p-2 text-gray-400 line-clamp-4 text-base">
              {companyData?.description}
            </span>
          </div>
          <div className="flex w-[50%] flex-col border-[#2e3b51] border-2 rounded-md px-4 py-2">
            <h1 className="text-lg font-medium tracking-wide p-2">
              Company Details
            </h1>
            <div className="flex my-2 justify-between p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-md font-medium tracking-wide text-[#535e81]">
                  Industry
                </p>
                <span>{companyData?.industry || "NA"}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-md font-medium tracking-wide text-[#535e81]">
                  Company Size
                </p>
                <span>{companyData?.companySize || "NA"}</span>
              </div>
            </div>

            <div className="flex my-2 justify-between p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-md font-medium tracking-wide text-[#535e81]">
                  Location
                </p>
                <span>{companyData?.location || "NA"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-[#2e3b51] border-2 p-4 rounded-lg">
          <h1 className="text-lg font-medium tracking-wide p-2">
            Social Links
          </h1>

          {companyData?.socialLinks?.length > 0 ? (
            <div></div>
          ) : (
            <p className="text-center my-6 font-normal text-gray-500">
              {" "}
              - No Social Media Links Available -{" "}
            </p>
          )}
        </div>

        <div className="border-red-500 bg-[#ddaaa5] border-2 p-6 rounded-lg">
          <h1 className="text-lg p-2 text-[#93000a] font-semibold">
            Danger Zone
          </h1>
          <p className="text-[#a92c33] font-normal tracking-wide pl-2">
            Once you delete a company, there is no going back. Please be
            certain.
          </p>

          <button className="bg-[#c02c2c] px-4 py-2 mt-4 rounded-lg flex items-center space-x-2 cursor-pointer hover:bg-red-800 transition-all duration-300">
            <MdDeleteForever size={22} />
            <p className="font-semibold">Delete Account</p>
          </button>
        </div>
      </div>

      {showEditDetails && (
        <EditCompanyDetails
          companyData={companyData}
          setShowEditDetails={setShowEditDetails}
        />
      )}
    </>
  );
};

export default Company;
