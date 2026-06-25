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

  isAuthenticated: boolean;

  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setCompanyName: (companyName: string) => void;
  setWebsite: (website: string) => void;
  setDescription: (description: string) => void;
  setDesignation: (designation: string) => void;
  setLoading: (loading: boolean) => void;
  setIsAuthenticated: (status: boolean) => void;

  resetData: () => void;
  createCompany: (Data: any) => any;
  loginAccount: (Data: any) => any;
  checkAuthStatus: () => Promise<boolean>;
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
  isAuthenticated: false,

  setName: (name: string) => set({ name }),
  setEmail: (email: string) => set({ email }),
  setPassword: (password: string) => set({ password }),
  setCompanyName: (companyName: string) => set({ companyName }),
  setWebsite: (website: string) => set({ website }),
  setDescription: (description: string) => set({ description }),
  setDesignation: (designation: string) => set({ designation }),
  setLoading: (loading: boolean) => set({ loading }),
  setIsAuthenticated: (status: boolean) => set({ isAuthenticated: status }),

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

  loginAccount: async (Data: any) => {
    set({ loading: true });
    try {
      const { LoginUser } = await import("../services/auth");
      const res = await LoginUser(Data);
      set({ isAuthenticated: true });
      return res;
    } catch (err) {
      set({ isAuthenticated: false, loading: false });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  checkAuthStatus: async () => {
    try {
      const { checkSession } = await import("../services/auth");
      const res = await checkSession();
      if (res.status === 200) {
        set({ isAuthenticated: true });
        return true;
      }
      return false;
    } catch (err) {
      set({ isAuthenticated: false });
      return false;
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
