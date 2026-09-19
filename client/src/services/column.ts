import axios from "axios";

interface CreateColumnPayload {
  projectID: string;
  title: string;
}

interface ColumnPositionPayload {
  _id: string;
  title: string;
  position: number;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API + "/column",
  withCredentials: true,
});

export const CreateColumn = async (data: CreateColumnPayload) => {
  return await API.post("/", data);
};

export const UpdateColumnPositions = async (
  columns: ColumnPositionPayload[],
) => {
  return await API.patch("/", { columns });
};

export const DeleteColumn = async (id: string) => {
  return await API.delete(`/${id}`);
};

export const GetColumnsByProjectID = async (projectID: string) => {
  return await API.get(`/${projectID}`);
};
