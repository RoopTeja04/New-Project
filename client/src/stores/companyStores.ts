import { create } from "zustand";
import { GetCompany, UpdateCompany } from "../services/company";

interface Company {
  companyData: any;
  loading: boolean;
  updating: boolean;

  setCompanyData: (companyData: any) => void;

  getCompany: (id: string) => Promise<any>;
  updateCompany: (id: string, payload: any) => Promise<any>;
}

const useCompanyStore = create<Company>((set) => ({
  companyData: null,
  loading: false,
  updating: false,

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

  updateCompany: async (id: string, payload: any) => {
    try {
      set({ updating: true });
      const res = await UpdateCompany(id, payload);
      set((state) => ({
        companyData: state.companyData
          ? { ...state.companyData, ...payload }
          : state.companyData,
      }));
      return res;
    } catch (err: any) {
      throw err.response?.data ?? err;
    } finally {
      set({ updating: false });
    }
  },
}));

export default useCompanyStore;
