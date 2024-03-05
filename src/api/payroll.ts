
import axios from "./axios";
import endpoints from "./endpoints";

export const getPayrollHistory = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(endpoints.payrolls);

    if (typeof data === "object") {
      return data ;
    }
    return [];
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
