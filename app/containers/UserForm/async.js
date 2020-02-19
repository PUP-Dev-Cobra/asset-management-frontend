import { API_URL } from 'App/constants'
import qs from 'query-string'

import { headers } from 'App/utils'
import { responseHandling } from 'App/async'

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
    `${API_URL}/user`,
    {
      method: 'POST',
      body: JSON.stringify(args[0]),
      headers
    }
  )

  return responseHandling(res)
}

export const update = async args => {
  const { uuid, ...arg } = args[0]
  const res = await fetch(
    `${API_URL}/user/${uuid}`,
    {
      method: 'PUT',
      body: JSON.stringify(arg),
      headers
    }
  )

  return responseHandling(res)
}

export const get = async args => {
  const res = await fetch(
    `${API_URL}/user/${args.uuid}`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
}

export const memberList = async args => {
  const res = await fetch(
    `${API_URL}/member/list?type=approved`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
}
