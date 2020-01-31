import { API_URL } from 'App/constants'
import { headers } from 'App/utils'
import { responseHandling } from 'App/async'

export const list = async args => {
  const res = await fetch(
    `${API_URL}/loan/list`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
}
