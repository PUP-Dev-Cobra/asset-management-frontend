import qs from 'query-string'

import { API_URL } from 'App/constants'
import { headers } from './utils'

export const options = async args => {
  const query = qs.stringify({ option_name: args.option_name })

  const res = await fetch(
    `${API_URL}/options?${query}`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
}

export const responseHandling = async res => {
  if (res.status !== 200) {
    const body = await res.json()
    throw new Error(body.error).message
  }

  return res.json()
}
