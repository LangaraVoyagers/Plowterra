import { ICreatePickerRequest, IPicker } from "project-2-types/lib/pickers";
import axios from "./axios";
import endpoints from "./endpoints";

export const getPickers = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(endpoints.pickers);

    if (typeof data === "object") {
      return data as Array<IPicker>;
    }
    return [];
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const getPickerById = async (id: string) => {
  try {
    const {
      data: { data },
    } = await axios.get(`${endpoints.pickers}/${id}`);
    return data as IPicker;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const createPicker = async (payload: ICreatePickerRequest) => {
  try {
    const {
      data: { data },
    } = await axios.post(endpoints.pickers, payload);
    return data as IPicker;
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
