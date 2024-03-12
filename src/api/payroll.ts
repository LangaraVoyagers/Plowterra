
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


type PayrollPreviewPayload ={
  farmId: string
  seasonId: string
  endDate?: number
}

export const getPayrollPreview = async (payload: PayrollPreviewPayload) => {
  try {
    const {
      data: { data },
    } = await axios.post(`${endpoints.payrolls}/preview`, payload);

    if (typeof data === "object") {
      return data ;
    }
    return [];
  } catch (error) {
    console.log({ error });
    throw error;
  }
};


export interface PayrollPayload {
  farmId: string;
  seasonId: string;
  endDate: number;
  totals: {
    totalGrossAmount: number;
    totalCollectedAmount: number;
    totalDeductions: number;
  };
}

export const createPayroll = async (payload: PayrollPayload) => {
  try {
    const response = await axios.post(`${endpoints.payrolls}`, payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      (error as any).response.status,
      (error as any).response.statusText
    );
    throw error;
  }
};

export const getSeasons = async () => {
  try {
    const response = await axios.get(`${endpoints.seasons}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      (error as any).response.status,
      (error as any).response.statusText
    );
    throw error;
  }
};