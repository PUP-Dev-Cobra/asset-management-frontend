import { API_URL } from 'App/constants'

import { headers } from 'App/utils'
import { responseHandling } from 'App/async'

export const ListDisbursment = async () => {
  const res = await fetch(
    `${API_URL}/disbursment/list`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
}

export const ListEncashment = async () => {
  const res = await fetch(
    `${API_URL}/encashment/list`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
}

export const ListReciept = async () => {
  const res = await fetch(
    `${API_URL}/reciept/list`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
}
