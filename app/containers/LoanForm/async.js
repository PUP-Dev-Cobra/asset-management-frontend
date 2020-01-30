import { API_URL } from 'App/constants'
import qs from 'query-string'

import { headers } from 'App/utils'

export const create = async args => {
  const res = await fetch(
    `${API_URL}/loan`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(args[0])
    }
  )

  if (res.status !== 200) {
    const body = await res.json()
    throw new Error(body.error).message
  }

  return res.json()
}

export const option = async args => {
  const query = qs.stringify({ option_name: args.option_name })

  const res = await fetch(
    `${API_URL}/options?${query}`,
    {
      method: 'GET',
      headers
    }
  )

  if (res.status !== 200) {
    const body = await res.json()
    throw new Error(body.error).message
  }

  return res.json()
}

export const memberList = async args => {
  const res = await fetch(
    `${API_URL}/loan/members`,
    {
      method: 'GET',
      headers
    }
  )

  if (res.status !== 200) {
    const body = await res.json()
    throw new Error(body.error).message
  }

  return res.json()
}

export const fetchMemberShares = async args => {
  const query = qs.stringify({ uuid: args[0].uuid })
  const res = await fetch(
    `${API_URL}/loan/member/share?${query}`,
    {
      method: 'GET',
      headers
    }
  )

  if (res.status !== 200) {
    const body = await res.json()
    throw new Error(body.error).message
  }

  return res.json()
}
