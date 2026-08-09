import axios from "axios";

interface ProjectMemberPayload {
  userID: string;
  role: string;
}

interface CreateProjectPayload {
  companyID?: string;
  ownerID?: string;
  name: string;
  description: string;
  techStack: string[];
  projectLink?: string;
  projectMembersData: ProjectMemberPayload[];
}

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API + "/project",
  withCredentials: true,
});

export const CreateProject = async (data: CreateProjectPayload) => {
  return await API.post("/", data);
};

export const GetProjectDetails = async (projectID: string) => {
  return await API.get(`/${projectID}`);
};

export const GetProjectByCompany = async (companyID: string) => {
  return await API.get(`/total-projects/${companyID}`);
};

export const GetProjectStats = async (companyID: string) => {
  return await API.get(`/stats/${companyID}`);
};
