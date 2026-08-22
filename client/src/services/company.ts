import axios from "axios";

interface UpdateCompanyPayload {
  companyName?: string;
  website?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  location?: string;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API + "/company",
  withCredentials: true,
});

export const GetCompany = async (id: string) => {
  return await API.get(`/${id}`);
};

export const UpdateCompany = async (id: string, data: UpdateCompanyPayload) => {
  return await API.put(`/${id}`, { data });
};
