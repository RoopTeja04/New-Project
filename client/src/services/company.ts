import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API + "/company",
  withCredentials: true,
});

const ProjectAPI = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API + "/project",
  withCredentials: true,
});

export const GetCompany = async (id: string) => {
  return await API.get(`/${id}`);
};

export const GetStats = async (id: string) => {
  return await ProjectAPI.get(`/stats/${id}`);
};
