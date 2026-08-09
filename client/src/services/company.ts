import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API + "/company",
  withCredentials: true,
});

export const GetCompany = async (id: string) => {
  return await API.get(`/${id}`);
};
