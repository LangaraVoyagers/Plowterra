import axios from "./axios"
import endpoints from "./endpoints"

export const getIndicators = async (id?: string) => {
  try {
    const {
      data: { data },
    } = await axios.get(`${endpoints.dashboardIndicators}/${id}`)

    if (typeof data === "object") {
      return data
    }
    return []
  } catch (error) {
    console.log({ error })
    throw error
  }
}

export const getGraphValues = async (id: string, fromDate?: number, toDate?: number) => {
  try {
    const {
      data: { data },
    } = await axios.get(`${endpoints.dashboardGraph}/${id}?${fromDate ? `fromDate=${fromDate}` : ""}&${toDate ? `toDate=${toDate}` : ""}`)

    if (typeof data === "object") {
      return data
    }
    return []
  } catch (error) {
    console.log({ error })
    throw error
  }
}

