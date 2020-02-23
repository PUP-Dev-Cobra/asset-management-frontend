import { API_URL } from 'App/constants'
import { responseHandling } from 'App/async'

export const resetPassword = async args => {
  const res = await fetch(
    `${API_URL}/forgot-password`,
    {
      method: 'POST',
      body: JSON.stringify(args[0]),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  return responseHandling(res)
}
