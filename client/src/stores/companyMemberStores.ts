import { GetMembers } from "../services/companyMembers";
import { create } from "zustand";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Member {
  _id: string;
  companyID: string;
  userID: User;
  role: string;
  designation: string;
}

interface CompanyMembers {
  members: Member[];
  loading: boolean;

  setMembers: (members: Member[]) => void;
  setLoading: (loading: boolean) => void;

  getCompanyMembers: (id: string) => Promise<any>;
}

const useCompanyMembersStore = create<CompanyMembers>((set) => ({
  members: [],
  loading: false,

  setMembers: (members) => set({ members }),
  setLoading: (loading) => set({ loading }),

  getCompanyMembers: async (id: string) => {
    try {
      set({ loading: true });

      const res = await GetMembers(id);
      set({ members: res.data.members });

      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useCompanyMembersStore;
