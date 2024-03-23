import { IHarvestLogResponse } from "project-2-types/dist/interface";

import axios from "./axios";
import endpoints from "./endpoints";

export const getHarvestLogs = async (params?: Record<string, unknown>) => {
  try {
    const {
      data: { data },
    } = await axios.get(endpoints.harvestLogs, { params });

    if (typeof data === "object") {
      return data as Array<IHarvestLogResponse>;
    }
    return [];
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

interface ICreateHarvestLog {
  farmId: string;
  collectedAmount: number;
  seasonId: string;
  pickerId: string;
  seasonDeductionIds: Array<string>;
  notes?: string;
  parentId?: string;
}

export const createHarvestLog = async (payload: ICreateHarvestLog) => {
  try {
    const {
      data: { data },
    } = await axios.post(endpoints.harvestLogs, payload);
    return data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const getHarvestLogById = async (id?: string) => {
  try {
    const {
      data: { data },
    } = await axios.get(`${endpoints.harvestLogs}/${id}`);
    return data as IHarvestLogResponse;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
