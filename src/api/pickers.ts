import { ICreatePickerRequest, IPicker } from "project-2-types/lib/pickers";
import axios from "./axios";
import endpoints from "./endpoints";

export const getPickers = async () => {
  try {
    const { data } = await axios<Array<IPicker>>(endpoints.pickers);
    return data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const getPickerById = async (id: string) => {
  try {
    const { data } = await axios<IPicker>(`${endpoints.pickers}/${id}`);
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
