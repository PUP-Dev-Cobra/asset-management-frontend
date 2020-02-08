import { API_URL } from 'App/constants'

import { headers } from 'App/utils'

export const authenticate = async args => {
  const res = await fetch(
    `${API_URL}/authenticate`,
    {
      method: 'POST',
      body: JSON.stringify(args[0]),
      headers: headers
    }
  )

  if (res.status !== 200) {
    const body = await res.json()
    throw new Error(body.error).message
  }
  return res.json()
}
