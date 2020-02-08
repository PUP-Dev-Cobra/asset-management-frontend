import { API_URL } from 'App/constants'

import { headers } from 'App/utils'

export const memberListAsync = async args => {
  const res = await fetch(
    `${API_URL}/member/list`,
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
