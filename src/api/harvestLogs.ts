import { IHarvestLog } from "project-2-types/lib/harvestLog";
import axios from "./axios";
// import endpoints from "./endpoints";

export const getHarvestLogs = async () => {
  try {
    const {
      data: { data },
    } 
    // = await axios.get(endpoints.harvestLogs);
    = await axios.get("http://localhost:9000/api/v1/harvestlog");

    if (typeof data === "object") {
      return data as Array<IHarvestLog>;
    }
    return [];
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
