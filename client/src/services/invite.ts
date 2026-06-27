import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API + "/invite",
  withCredentials: true,
});

export const SendInvite = async(data: any) => {
  return await API.post("/", data);
}