import { create } from "zustand";
import { createUser } from "../services/auth";

interface AuthState {
  name: string;
  email: string;
  password: string;
  companyName: string;
  website: string;
  description: string;
  designation: string;
  loading: boolean;

  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setCompanyName: (companyName: string) => void;
  setWebsite: (website: string) => void;
  setDescription: (description: string) => void;
  setDesignation: (designation: string) => void;
  setLoading: (loading: boolean) => void;

  resetData: () => void;
  createCompany: (Data: any) => any;
  
}

const useAuthStore = create<AuthState>((set) => ({
  name: "",
  email: "",
  password: "",
  companyName: "",
  website: "",  
  description: "",
  designation: "",
  loading: false,

  setName: (name: string) => set({ name }),
  setEmail: (email: string) => set({ email }),
  setPassword: (password: string) => set({ password }),
  setCompanyName: (companyName: string) => set({ companyName }),
  setWebsite: (website: string) => set({ website }),
  setDescription: (description: string) => set({ description }),
  setDesignation: (designation: string) => set({ designation }),
  setLoading: (loading: boolean) => set({ loading }),

  createCompany: async (Data: any) => {
    set({ loading: true });
    try{
      const res = await createUser(Data);
      return res;
    }catch(err){
      set({loading: false});
      throw err;
    }
    finally{
      set({loading: false});
    }
  },

  resetData: () =>
    set({
      name: "",
      email: "",
      password: "",
      companyName: "",
      website: "",
      description: "",
      designation: "",
    }),
}));

export default useAuthStore;
