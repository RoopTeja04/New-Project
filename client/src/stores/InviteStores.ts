import { create } from "zustand";
import { DeleteInvite, SendInvite, getHistoryInvite } from "../services/invite";

interface Invite {
  inviteData: any[];
  loading: boolean;

  setInviteData: (inviteData: any[]) => void;
  setLoading: (loading: boolean) => void;

  sendInvite: (data: any) => Promise<any>;
  getInviteHistory: (companyID: string) => Promise<any>;
  deleteInvite: (id: string) => Promise<any>;
}

const useInviteStore = create<Invite>((set) => ({
  inviteData: [],
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
      set({ loading: false });
    }
  },

  getInviteHistory: async (companyID: string) => {
    try {
      set({ loading: true });
      const res = await getHistoryInvite(companyID);
      set({ inviteData: res.data.InvitationHistory, loading: false });
    } catch (err: any) {
      set({ loading: false });
      throw err.response?.data ?? err;
    } finally {
      set({ loading: false });
    }
  },

  deleteInvite: async (id: string) => {
    try {
      set({ loading: true });
      const res = await DeleteInvite(id);
      set({ loading: false });
    } catch (err: any) {
      set({ loading: false });
      throw err.response?.data ?? err;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useInviteStore;
