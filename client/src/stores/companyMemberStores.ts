import { GetMembers } from "../services/companyMembers";
import { create } from "zustand";

interface CompanyMembers {
  members: [];
  loading: boolean;

  setMembers: (members: any) => void;
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
