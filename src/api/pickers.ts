import endpoints from "./endpoints";

const API_URL = import.meta.env.VITE_API_URL;

export const getPickers = async () => {
  try {
    // TODO: Replace with axios
    const result = await fetch(`${API_URL}${endpoints.pickers}`);
    const data = await result.json();
    return data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const getPickerById = async (id: string) => {
  try {
    const result = await fetch(`${API_URL}${endpoints.pickers}/${id}`);
    const data = await result.json();
    return data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const createPicker = () => {
  try {
    return; 
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
