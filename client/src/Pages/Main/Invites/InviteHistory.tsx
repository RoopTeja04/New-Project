import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useCompanyStore from "../../../stores/companyStores";
import useInviteStore from "../../../stores/InviteStores";
import { TbXboxXFilled } from "react-icons/tb";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const InviteHistory = () => {
  const navigate = useNavigate();

  const { companyData } = useCompanyStore();
  const { getInviteHistory, inviteData, deleteInvite, loading } =
    useInviteStore();

  const [deletedId, setDeletedId] = useState<string>("");

  useEffect(() => {
    if (companyData?._id) {
      getInviteHistory(companyData._id);
    }
  }, [companyData?._id]);

  const handleDeleteBtn = async (id: string) => {
    try {
      setDeletedId(id);
      const res = await deleteInvite(id);
      toast.success(res?.data?.message || "Invite deleted successfully");
      getInviteHistory(companyData._id);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete invite");
    }
  };

  return (
    <>
      <div className="py-8 px-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="border border-gray-500 px-2 py-1 rounded-lg"
          >
            <MdKeyboardArrowLeft size={26} />
          </button>
          <h1 className="text-xl font-semibold tracking-wide">
            Employee Invitation History
          </h1>
        </div>

        <div className="my-8 overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr className="border-b-2 border-gray-400">
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  Invited By
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  Expires At
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  Designation
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-50 backdrop-blur-2xl">
              {inviteData.length > 0 ? (
                inviteData.map((data: any, index: number) => (
                  <tr key={index} className="text-black">
                    <td className="px-4 py-4 border-t border-gray-300">
                      {data.invitedID.name || data.email || "-"}
                    </td>
                    <td className="px-4 py-4 border-t border-gray-300">
                      {data.email || "-"}
                    </td>
                    <td className="px-4 py-4 border-t border-gray-300">
                      {data.invitedID.name || "-"}
                    </td>
                    <td className="px-4 py-4 border-t border-gray-300">
                      {data.expiresAt
                        ? new Date(data.expiresAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-4 border-t border-gray-300">
                      {data.designation || "-"}
                    </td>
                    <td className="px-4 py-4 border-t border-gray-300">
                      {data.status || "-"}ed
                    </td>
                    <td className="px-4 py-4 border-t border-gray-300">
                      <button
                        onClick={() => handleDeleteBtn(data._id)}
                        disabled={loading}
                        className="border-2 border-gray-500 rounded-lg flex items-center space-x-2 px-4 py-1 bg-[#f1f1fa] cursor-pointer hover:bg-red-200 transition-colors duration-300 disabled:opacity-60"
                      >
                        {deletedId === data._id ? (
                          <>
                            <TbXboxXFilled size={20} className="text-red-700" />
                            <p className="text-md font-semibold">Deleting...</p>
                          </>
                        ) : (
                          <>
                            <TbXboxXFilled size={20} className="text-red-700" />
                            <p className="text-md font-semibold">Delete</p>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="w-full">
                  <td className="px-12 py-20 text-center" colSpan={7}>
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
                      <p className="text-lg font-medium">
                        No invitation history yet
                      </p>
                      <p className="text-sm text-gray-500">
                        Invites sent to teammates will appear here once they are
                        added.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default InviteHistory;
