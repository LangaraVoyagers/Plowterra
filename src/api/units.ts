import axios from "./axios"
import endpoints from "./endpoints"

export const getUnits = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(endpoints.units)

    if (typeof data === "object") {
      return data
    }
    return []
  } catch (error) {
    console.log({ error })
    throw error
  }
}

export const getUnitsById = async (id?: string) => {
  try {
    const {
      data: { data },
    } = await axios.get(`${endpoints.units}/${id}`)
    return data
  } catch (error) {
    console.log({ error })
    throw error
  }
}

export const createUnit = async (name: string) => {
  try {
    const {
      data: { data },
    } = await axios.post(endpoints.units, { name })

    if (typeof data === "object") {
      return data
    }
    return null
  } catch (error) {
    console.log({ error })
    throw error
  }
}