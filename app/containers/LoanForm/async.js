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
    `${API_URL}/loan/${args[0].uuid}`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
}

export const update = async args => {
  const { uuid, ...rest } = args[0]
  const res = await fetch(
    `${API_URL}/loan/${uuid}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(rest)
    }
  )

  return responseHandling(res)
}

export const createDisbursment = async args => {
  const res = await fetch(
    `${API_URL}/disbursment`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(args[0])
    }
  )

  return responseHandling(res)
}

export const fetchDisbursment = async args => {
  const res = await fetch(
    `${API_URL}/disbursment/${args[0].uuid}`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
}

export const updateDisbursment = async args => {
  const { uuid, ...rest } = args[0]
  const res = await fetch(
    `${API_URL}/disbursment/${uuid}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(rest)
    }
  )

  return responseHandling(res)
}

export const crateEncashment = async args => {
  const res = await fetch(
    `${API_URL}/encashment`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(args[0])
    }
  )

  return responseHandling(res)
}

export const fetchEncashment = async args => {
  const res = await fetch(
    `${API_URL}/encashment/${args[0].uuid}`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
}

export const submitReciept = async args => {
  const res = await fetch(
    `${API_URL}/reciept`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(args[0])
    }
  )

  return responseHandling(res)
}
