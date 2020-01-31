import { API_URL } from 'App/constants'
import qs from 'query-string'

import { headers } from 'App/utils'
import { responseHandling } from 'App/async'

export const create = async args => {
  const res = await fetch(
    `${API_URL}/loan`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(args[0])
    }
  )

  return responseHandling(res)
}

export const memberList = async args => {
  const res = await fetch(
    `${API_URL}/loan/members`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
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

  return responseHandling(res)
}

export const fetchLoanInfo = async args => {
  const res = await fetch(
    `${API_URL}/loan/${args.uuid}`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
}
