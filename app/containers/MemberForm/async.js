import { API_URL } from 'App/constants'
import { responseHandling } from 'App/async'

import qs from 'query-string'

import { headers } from 'App/utils'

export const option = async args => {
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

export const create = async args => {
  const res = await fetch(
    `${API_URL}/member`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(args[0])
    }
  )

  return responseHandling(res)
}

export const update = async args => {
  const res = await fetch(
    `${API_URL}/member/${args[0].uuid}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(args[0])
    }
  )

  return responseHandling(res)
}

export const fetchMember = async args => {
  const res = await fetch(
    `${API_URL}/member/${args.uuid}`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
}
