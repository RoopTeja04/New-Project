import { create } from "zustand";
import { SendInvite } from "../services/invite";

interface Invite {
  inviteData: any;
  loading: boolean;

  setInviteData: (inviteData: any) => void;
  setLoading: (loading: boolean) => void;

  sendInvite: (data: any) => Promise<any>;
}

const useInviteStore = create<Invite>((set) => ({
  inviteData: null,
  loading: false,

  setInviteData: (inviteData: any) => set({ inviteData }),
  setLoading: (loading: boolean) => set({ loading }),

  sendInvite: async (data: any) => {
    try {
      set({ loading: false });
      const res = await SendInvite(data);
      return res;
    } catch (err: any) {
      set({ loading: false });
      throw err.response?.data ?? err;
    } finally {
      set({ inviteData: null, loading: false });
    }
  },
}));

export default useInviteStore;
