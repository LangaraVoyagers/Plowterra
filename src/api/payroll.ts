
import axios from "./axios";
import endpoints from "./endpoints";
import { IPayrollResponse } from "project-2-types/dist/interface"

export const getPayrollHistory = async (params: Record<string, unknown>) => {
  try {
    const {
      data: { data },
    } = await axios.get(endpoints.payrolls, { params })

    if (typeof data === "object") {
      return data
    }
    return []
  } catch (error) {
    console.log({ error })
    throw error
  }
}

type PayrollPreviewPayload = {
  farmId: string
  seasonId: string
  endDate?: number
  startDate?: number
}

export const getPayrollPreview = async (payload: PayrollPreviewPayload) => {
  try {
    const {
      data: { data },
    } = await axios.post(`${endpoints.payrolls}/preview`, payload)

    if (typeof data === "object") {
      return data as IPayrollResponse
    }
    return null
  } catch (error) {
    console.log({ error })
    throw error
  }
}

export interface PayrollPayload {
  farmId: string
  seasonId: string
  endDate: number
  startDate: number
  totals: {
    totalGrossAmount: number
    totalCollectedAmount: number
    totalDeductions: number
  }
}

export const createPayroll = async (payload: PayrollPayload) => {
  try {
    const response = await axios.post(`${endpoints.payrolls}`, payload)

    return response.data
  } catch (error) {
    console.error(
      "Error:",
      (error as any).response.status,
      (error as any).response.statusText
    )
    throw error
  }
}
