import { API_URL } from 'App/constants'
import { responseHandling } from 'App/async'

export const resetPassword = async args => {
  const res = await fetch(
    `${API_URL}/reset-password/${args[0].hash}`,
    {
      method: 'POST',
      body: JSON.stringify({ password: args[0].password }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  return responseHandling(res)
}
