import { API_URL } from 'App/constants'
import { headers } from 'App/utils'
import { responseHandling } from 'App/async'

export const fetchRecieptAsync = async args => {
  const res = await fetch(
    `${API_URL}/reciept/list/${args.uuid}`,
    {
      method: 'GET',
      headers
    }
  )
  return responseHandling(res)
}
