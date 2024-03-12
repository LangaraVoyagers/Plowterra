import axios from "./axios"
import endpoints from "./endpoints"

export const getCurrencies = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(endpoints.currencies)

    if (typeof data === "object") {
      return data
    }
    return []
  } catch (error) {
    console.log({ error })
    throw error
  }
}

export const getCurrencyById = async (id?: string) => {
  try {
    const {
      data: { data },
    } = await axios.get(`${endpoints.currencies}/${id}`)
    return data
  } catch (error) {
    console.log({ error })
    throw error
  }
}
