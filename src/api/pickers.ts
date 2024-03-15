import {
  ICreatePickerRequest,
  IPickerResponse,
} from "project-2-types/dist/interface"

import axios from "./axios"
import endpoints from "./endpoints"

export const getPickers = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(endpoints.pickers)

    if (typeof data === "object") {
      return data as Array<IPickerResponse>
    }
    return []
  } catch (error) {
    console.log({ error })
    throw error
  }
}

export const getPickerById = async (id?: string | null) => {
  try {
    if (!id) {
      return
    }
    const {
      data: { data },
    } = await axios.get(`${endpoints.pickers}/${id}`)
    return data as IPickerResponse
  } catch (error) {
    console.log({ error })
    throw error
  }
}

export const upsertPicker = async ({
  pickerId,
  ...payload
}: ICreatePickerRequest & { pickerId?: string }) => {
  try {
    if (pickerId) {
      const {
        data: { data },
      } = await axios.put(`${endpoints.pickers}/${pickerId}`, payload)

      return data as IPickerResponse
    }
    const {
      data: { data },
    } = await axios.post(endpoints.pickers, payload)
    return data as IPickerResponse
  } catch (error) {
    console.log({ error })
    throw error
  }
}

export const deletePicker = async (pickerId?: string) => {
  try {
    const {
      data: { data },
    } = await axios.delete(`${endpoints.pickers}/${pickerId}`)

    return data as IPickerResponse
  } catch (error) {
    console.log({ error })
    throw error
  }
}
