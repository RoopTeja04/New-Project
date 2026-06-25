import { create } from "zustand";
import { GetCompany } from "../services/company";

interface Company {
  companyData: any;
  loading: boolean;

  setCompanyData: (companyData: any) => void;

  getCompany: (id: string) => Promise<any>;
}

const useCompanyStore = create<Company>((set) => ({
  companyData: null,
  loading: false,

  setCompanyData: (companyData: any) => set({ companyData }),

  getCompany: async (id: string) => {
    try {
      set({ loading: true });
      const res = await GetCompany(id);
      set({ companyData: res.data.FindCompany });
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useCompanyStore;
