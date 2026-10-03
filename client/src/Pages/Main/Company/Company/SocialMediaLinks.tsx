import { useState } from "react";
import { FaGlobe } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import useAuthStore from "../../../../stores/authStores";
import useCompanyStore from "../../../../stores/companyStores";
import AddSocialLink, { socialPlatforms } from "./AddSocialLink";

const SocialMediaLinks = () => {
  const { userId } = useAuthStore();
  const { companyData, updateCompany } = useCompanyStore();

  const [showAddLink, setShowAddLink] = useState(false);
  const [deletingLink, setDeletingLink] = useState<string | null>(null);

  const socialLinks = companyData?.socialLinks || [];

  const getPlatformMeta = (platform: string) =>
    socialPlatforms.find((p) => p.name === platform) || {
      name: platform,
      icon: FaGlobe,
      color: "text-gray-400",
    };

  const handleDeleteLink = async (linkID: string) => {
    setDeletingLink(linkID);
    try {
      const updatedLinks = socialLinks.filter(
        (link: any) => link._id !== linkID,
      );
      await updateCompany(userId, { socialLinks: updatedLinks });
      toast.success("Social Link Removed Successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove social link");
    } finally {
      setDeletingLink(null);
    }
  };

  return (
    <div className="border-[#2e3b51] border-2 p-4 rounded-lg">
      <div className="flex items-center justify-between p-2">
        <h1 className="text-lg font-medium tracking-wide">Social Links</h1>

        <button
          onClick={() => setShowAddLink(true)}
          className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700 cursor-pointer"
        >
          Add Link
        </button>
      </div>

      {socialLinks.length > 0 ? (
        <div className="flex gap-2 p-2">
          {socialLinks.map((link: any) => {
            const meta = getPlatformMeta(link.platform);
            const Icon = meta.icon;

            return (
              <div
                key={link._id}
                className="flex items-center gap-3 rounded-lg border border-gray-800 bg-[#08162B] px-4 py-2.5"
              >
                <Icon className={`text-lg ${meta.color}`} />

                <div className="flex">
                  <a href={link.url} className="text-sm font-medium text-white">
                    {link.platform}
                  </a>
                </div>

                <button
                  onClick={() => handleDeleteLink(link._id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-600 transition hover:bg-gray-800 cursor-pointer"
                >
                  {deletingLink === link._id ? "..." : <RxCross2 />}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center my-6 font-normal text-gray-500">
          {" "}
          - No Social Media Links Available -{" "}
        </p>
      )}

      {showAddLink && (
        <AddSocialLink
          companyData={companyData}
          setShowAddLink={setShowAddLink}
        />
      )}
    </div>
  );
};

export default SocialMediaLinks;
