import axios from "./axios"
import endpoints from "./endpoints"

export const getDeductions = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(endpoints.deductions)

    if (typeof data === "object") {
      return data
    }
    return []
  } catch (error) {
    console.log({ error })
    throw error
  }
}

export const createDeduction = async (name: string) => {
  try {
    const {
      data: { data },
    } = await axios.post(endpoints.deductions, { name })

    if (typeof data === "object") {
      return data
    }
    return null
  } catch (error) {
    console.log({ error })
    throw error
  }
}
