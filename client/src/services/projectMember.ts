import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API + "/project-member",
  withCredentials: true,
});

export const AddProjectMember = async (data: any) => {
  return await API.post("/", data);
};

export const DeleteProjectMemeber = async (
  memberID: string,
  projectID: string,
) => {
  return await API.delete(`/${memberID}/${projectID}`);
};
