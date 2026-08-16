import { create } from "zustand";
import {
  CreateProject,
  GetProjectByCompany,
  GetProjectDetails,
  GetProjectStats,
  UpdateProjectDetails,
} from "../services/project";

interface ProjectState {
  projects: any[];
  projectDetails: any;
  stats: any;
  loading: boolean;
  creating: boolean;
  updating: boolean;

  setLoading: (loading: boolean) => void;

  createProject: (data: any) => Promise<any>;
  getProjectByCompany: (companyID: string) => Promise<any>;
  getProjectDetails: (projectID: string) => Promise<any>;
  getProjectStats: (companyID: string) => Promise<any>;
  updateProjectDetails: (projectID: string, payload: any) => Promise<any>;
}

const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  projectDetails: null,
  stats: null,
  loading: false,
  creating: false,
  updating: false,

  setLoading: (loading: boolean) => set({ loading }),

  createProject: async (data: any) => {
    try {
      set({ creating: true });
      const res = await CreateProject(data);
      set((state) => ({ projects: [res.data.newProject, ...state.projects] }));
      return res;
    } catch (err: any) {
      throw err.response?.data ?? err;
    } finally {
      set({ creating: false });
    }
  },

  getProjectByCompany: async (companyID: string) => {
    try {
      set({ loading: true });
      const res = await GetProjectByCompany(companyID);
      set({ projects: res.data.Projects });
      return res;
    } catch (err: any) {
      throw err.response?.data ?? err;
    } finally {
      set({ loading: false });
    }
  },

  getProjectDetails: async (projectID: string) => {
    try {
      set({ loading: true });
      const res = await GetProjectDetails(projectID);
      set({ projectDetails: res.data });
      return res;
    } catch (err: any) {
      throw err.response?.data ?? err;
    } finally {
      set({ loading: false });
    }
  },

  getProjectStats: async (companyID: string) => {
    try {
      set({ loading: true });
      const res = await GetProjectStats(companyID);
      set({ stats: res.data.stats });
      return res;
    } catch (err: any) {
      throw err.response?.data ?? err;
    } finally {
      set({ loading: false });
    }
  },

  updateProjectDetails: async (projectID: string, payload: any) => {
    try {
      set({ updating: true });
      const res = await UpdateProjectDetails(projectID, payload);
      set((state) => ({
        projectDetails: state.projectDetails
          ? {
              ...state.projectDetails,
              project: { ...state.projectDetails.project, ...payload },
            }
          : state.projectDetails,
        projects: state.projects.map((p) =>
          p._id === projectID ? { ...p, ...payload } : p,
        ),
      }));
      return res;
    } catch (err: any) {
      throw err.response?.data ?? err;
    } finally {
      set({ updating: false });
    }
  },
}));

export default useProjectStore;
