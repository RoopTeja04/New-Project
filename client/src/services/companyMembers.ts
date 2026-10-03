import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API + "/member",
  withCredentials: true,
});

export const GetMembers = async (id: string) => {
  return await API.get(`/${id}`);
};