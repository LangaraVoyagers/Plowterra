import axios from "./axios"
import endpoints from "./endpoints"

export const getProducts = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(endpoints.products)

    if (typeof data === "object") {
      return data
    }
    return []
  } catch (error) {
    console.log({ error })
    throw error
  }
}

export const getProductById = async (id?: string) => {
  try {
    const {
      data: { data },
    } = await axios.get(`${endpoints.products}/${id}`)
    return data
  } catch (error) {
    console.log({ error })
    throw error
  }
}

export const createProduct = async (name: string) => {
  try {
    const {
      data: { data },
    } = await axios.post(endpoints.products, { name })

    if (typeof data === "object") {
      return data
    }
    return null
  } catch (error) {
    console.log({ error })
    throw error
  }
}