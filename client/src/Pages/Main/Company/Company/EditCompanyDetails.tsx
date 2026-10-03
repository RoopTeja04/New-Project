import { useState } from "react";
import { IoChevronDown, IoCheckmark, IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import useAuthStore from "../../../../stores/authStores";
import useCompanyStore from "../../../../stores/companyStores";

const EditCompanyDetails = ({ companyData, setShowEditDetails }: any) => {
  const { userId } = useAuthStore();
  const { updateCompany, updating } = useCompanyStore();

  const companySizes = ["1-10", "11-50", "51-200", "201-500", "500+"];

  const [Data, setData] = useState({
    companyName: companyData?.companyName || "",
    website: companyData?.website || "",
    description: companyData?.description || "",
    industry: companyData?.industry || "",
    companySize: companyData?.companySize || "",
    location: companyData?.location || "",
  });
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [errors, setErrors] = useState({ companyName: "", description: "" });

  const handleUpdate = async () => {
    const newErrors = { companyName: "", description: "" };

    if (!Data.companyName.trim()) {
      newErrors.companyName = "Company name is required.";
    }

    if (!Data.description.trim()) {
      newErrors.description = "Company description is required.";
    }

    setErrors(newErrors);

    if (newErrors.companyName || newErrors.description) return;

    try {
      const res = await updateCompany(userId, Data);
      toast.success(res?.data?.message || "Company Details Updated Successfully");
      setShowEditDetails(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update company details");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-gray-700 bg-[#08111F] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-6 flex items-center justify-between border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-semibold text-white">Edit Company Details</h2>

          <button
            onClick={() => setShowEditDetails(false)}
            className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-gray-700 hover:text-white"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2 flex flex-col space-y-2">
            <label className="font-bold text-gray-300">Company Name</label>
            <input
              type="text"
              value={Data.companyName}
              onChange={(e) => {
                setData({ ...Data, companyName: e.target.value });
                if (errors.companyName) setErrors({ ...errors, companyName: "" });
              }}
              placeholder="Enter company name"
              className="w-full rounded-xl border border-gray-600 bg-transparent px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500"
            />
            {errors.companyName && (
              <p className="text-sm text-red-500">{errors.companyName}</p>
            )}
          </div>

          <div className="col-span-2 flex flex-col space-y-2">
            <label className="font-bold text-gray-300">Description</label>
            <textarea
              rows={4}
              value={Data.description}
              onChange={(e) => {
                setData({ ...Data, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: "" });
              }}
              placeholder="Enter company description"
              className="w-full resize-none rounded-xl border border-gray-600 bg-transparent px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-300">Website</label>
            <input
              type="url"
              value={Data.website}
              onChange={(e) => setData({ ...Data, website: e.target.value })}
              placeholder="https://example.com"
              className="w-full rounded-xl border border-gray-600 bg-transparent px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-300">Industry</label>
            <input
              type="text"
              value={Data.industry}
              onChange={(e) => setData({ ...Data, industry: e.target.value })}
              placeholder="e.g: IT Services & Consulting"
              className="w-full rounded-xl border border-gray-600 bg-transparent px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative flex flex-col space-y-2">
            <label className="font-bold text-gray-300">Company Size</label>
            <button
              type="button"
              onClick={() => setShowSizeDropdown(!showSizeDropdown)}
              className={`flex w-full items-center justify-between rounded-xl border bg-transparent px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                Data.companySize
                  ? "border-blue-500/60 text-white"
                  : "border-gray-600 text-gray-400"
              }`}
            >
              <span>{Data.companySize || "Select company size"}</span>
              <IoChevronDown
                className={`transition-transform duration-200 ${
                  showSizeDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showSizeDropdown && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-gray-600 bg-[#0D1B2A] shadow-2xl">
                {companySizes.map((size) => {
                  const isSelected = Data.companySize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setData({ ...Data, companySize: size });
                        setShowSizeDropdown(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm transition ${
                        isSelected
                          ? "bg-blue-500/10 text-blue-300"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      <span>{size} employees</span>
                      {isSelected && (
                        <IoCheckmark size={18} className="text-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-bold text-gray-300">Location</label>
            <input
              type="text"
              value={Data.location}
              onChange={(e) => setData({ ...Data, location: e.target.value })}
              placeholder="e.g. Hyderabad, India"
              className="w-full rounded-xl border border-gray-600 bg-transparent px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-gray-700 pt-4">
          <button
            type="button"
            onClick={() => setShowEditDetails(false)}
            className="cursor-pointer rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={updating}
            onClick={handleUpdate}
            className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyDetails;
