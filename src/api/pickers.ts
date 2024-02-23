import { ICreatePickerRequest, IPicker } from "project-2-types/lib/pickers";
import axios from "./axios";
import endpoints from "./endpoints";

console.log(import.meta.env.VITE_API_URL);

export const getPickers = async () => {
  try {
    const { data } = await axios.get<Array<IPicker>>(endpoints.pickers);
    console.log({ data });
    if (typeof data === "object") {
      return data;
    }
    return [];
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const getPickerById = async (id: string) => {
  try {
    const { data } = await axios.get<IPicker>(`${endpoints.pickers}/${id}`);
    return data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const createPicker = async (payload: ICreatePickerRequest) => {
  try {
    const { data } = await axios.post<IPicker>(endpoints.pickers, payload);
    return data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const updatePicker = () => {
  try {
    return;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const deletePicker = () => {
  try {
    return;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
