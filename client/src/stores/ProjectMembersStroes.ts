import { create } from "zustand";
import { AddProjectMember, GetProjectMembers } from "../services/projectMember";

interface ProjectMemberState {
  newMember: any;
  projectMembers: any;

  setNewMember: (member: any) => void;
  setProjectMembers: (projectMembers: any) => void;

  addProjectMember: (data: any) => Promise<any>;
  getProjectMember: (data: any) => Promise<any>;
}

const useProjectMemberStore = create<ProjectMemberState>((set) => ({
  newMember: null,
  projectMembers: [],

  setNewMember: (member) => set({ newMember: member }),
  setProjectMembers: (projectMember) => set({ projectMembers: projectMember }),

  addProjectMember: async (data: any) => {
    try {
      const res = await AddProjectMember(data);
      return res;
    } catch (error) {
      throw error;
    } finally {
      set({ newMember: null });
    }
  },

  getProjectMember: async (projectID: any) => {
    try {
      const res = await GetProjectMembers(projectID);
      set({ projectMembers: res.data.FindMembers });
    } catch (error) {
      throw error;
    }
  },
}));

export default useProjectMemberStore;
