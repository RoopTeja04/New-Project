import axios from "axios";

interface InvitePayload {
  companyID?: string;
  invitedID?: string;
  email?: string;
  role?: string;
  designation?: string;
}

interface InvitationResponsePayload {
  token: string | null;
  status: string;
  name?: string;
  password?: string;
}

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_API}/invite`,
  withCredentials: true,
});

export const SendInvite = async (data: InvitePayload) => {
  return await API.post("/", data);
};

export const getHistoryInvite = async (companyID: string) => {
  return await API.get(`/${companyID}`);
};

export const DeleteInvite = async (id: string) => {
  return await API.delete(`/${id}`);
};

export const RespondToInvitation = async (data: InvitationResponsePayload) => {
  return await API.post("/respond", data);
};
