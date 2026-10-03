import { useState } from "react";
import { IoChevronDown, IoCheckmark, IoClose } from "react-icons/io5";
import {
  FaLinkedin,
  FaXTwitter,
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa6";
import { toast } from "react-toastify";
import useAuthStore from "../../../../stores/authStores";
import useCompanyStore from "../../../../stores/companyStores";

export const socialPlatforms = [
  { name: "LinkedIn", icon: FaLinkedin, color: "text-blue-500" },
  { name: "Twitter / X", icon: FaXTwitter, color: "text-gray-200" },
  { name: "Facebook", icon: FaFacebook, color: "text-blue-600" },
  { name: "Instagram", icon: FaInstagram, color: "text-pink-500" },
  { name: "GitHub", icon: FaGithub, color: "text-gray-300" },
  { name: "YouTube", icon: FaYoutube, color: "text-red-500" },
  { name: "Other", icon: FaGlobe, color: "text-gray-400" },
];

const AddSocialLink = ({ companyData, setShowAddLink }: any) => {
  const { userId } = useAuthStore();
  const { updateCompany, updating } = useCompanyStore();

  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [error, setError] = useState("");

  const selectedPlatform = socialPlatforms.find((p) => p.name === platform);

  const urlRegex =
    /^https?:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/[^\s]*)?$/;

  const handleAddLink = async () => {
    if (!platform || !url.trim()) {
      setError("Please select a platform and enter a link.");
      return;
    }

    if (!platform) {
      setError("Please select a platform.");
      return;
    }

    if (!urlRegex.test(url)) {
      setError("Please enter a valid url.");
      return;
    }

    setError("");

    try {
      const existingLinks = companyData?.socialLinks || [];
      const updatedLinks = [...existingLinks, { platform, url: url.trim() }];

      const res = await updateCompany(userId, { socialLinks: updatedLinks });
      toast.success(res?.data?.message || "Social Link Added Successfully");
      setShowAddLink(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add social link");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-gray-700 bg-[#08111F] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-6 flex items-center justify-between border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-semibold text-white">Add Social Link</h2>

          <button
            onClick={() => setShowAddLink(false)}
            className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-gray-700 hover:text-white"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex w-full flex-col space-y-2">
          <label className="font-bold text-gray-300">Platform</label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
              className={`flex w-full items-center justify-between rounded-xl border bg-transparent px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                platform
                  ? "border-blue-500/60 text-white"
                  : "border-gray-600 text-gray-400"
              }`}
            >
              <span className="flex items-center gap-2">
                {selectedPlatform && (
                  <selectedPlatform.icon className={selectedPlatform.color} />
                )}
                <span>{platform || "Select platform"}</span>
              </span>

              <IoChevronDown
                className={`transition-transform duration-200 ${
                  showPlatformDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showPlatformDropdown && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-y-auto scrollbar-hide rounded-xl border border-gray-600 bg-[#0D1B2A] shadow-2xl">
                {socialPlatforms.map((item) => {
                  const isSelected = platform === item.name;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm transition ${
                        isSelected
                          ? "bg-blue-500/10 text-blue-300"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                      onClick={() => {
                        setPlatform(item.name);
                        setShowPlatformDropdown(false);
                        if (error) setError("");
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className={item.color} />
                        <span>{item.name}</span>
                      </span>

                      {isSelected && (
                        <IoCheckmark size={18} className="text-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex w-full flex-col space-y-2">
          <label className="font-bold text-gray-300">Profile Link</label>
          <input
            autoFocus
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
            placeholder="https://example.com/your-profile"
            className="w-full rounded-xl border border-gray-600 bg-transparent px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end gap-3 border-t border-gray-700 pt-4">
          <button
            type="button"
            onClick={() => setShowAddLink(false)}
            className="cursor-pointer rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={updating}
            onClick={handleAddLink}
            className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating ? "Adding..." : "Add Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSocialLink;
