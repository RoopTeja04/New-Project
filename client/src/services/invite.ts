import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API + "/invite",
  withCredentials: true,
});

export const SendInvite = async (data: any) => {
  return await API.post("/", data);
};

export const getHistoryInvite = async (companyID: string) => {
  return await API.get(`/${companyID}`);
};

export const DeleteInvite = async (id: string) => {
  return await API.delete(`/${id}`);
};
