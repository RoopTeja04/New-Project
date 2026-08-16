import { create } from "zustand";
import { AddProjectMember } from "../services/projectMember";

interface ProjectMemberState {
  newMember: any;

  setNewMember: (member: any) => void;

  addProjectMember: (data: any) => Promise<any>;
}

const useProjectMemberStore = create<ProjectMemberState>((set) => ({
  newMember: null,

  setNewMember: (member) => set({ newMember: member }),

  addProjectMember: async (data: any) => {
    try {
      const res = await AddProjectMember(data);
      return res;
    } catch (error) {
      throw error;
    }
    finally {
      set({ newMember: null });
    }
  },
}));

export default useProjectMemberStore;