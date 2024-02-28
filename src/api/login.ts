import axios from "./axios";
import endpoints from "./endpoints";

interface User {
  email: string;
  password: string;
}

export const login = async (user: User) => {
  try {
    const { data } = await axios.post(endpoints.signin, user);
    return data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
