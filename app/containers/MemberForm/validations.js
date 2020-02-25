import qs from 'querystring'
import debounce from 'lodash/debounce'

import { API_URL } from 'App/constants'
import { headers } from 'App/utils'
import { simpleMemoize } from 'Helpers/utils'

export const emailDuplicate = debounce(simpleMemoize(async value => {
  if (!value) {
    return 'Required'
  }

  const query = qs.stringify({ email: value })

  const res = await fetch(
    `${API_URL}/validations/email-duplicate?${query}`,
    {
      method: 'GET',
      headers
    }
  )

  const message = await res.json()
  if (res.status !== 200) {
    return message?.error
  }

  if (message?.error) {
    return message.error
  }
}), 500)
