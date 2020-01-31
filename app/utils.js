import get from 'lodash/get'
import qs from 'query-string'

import { responseHandling } from './async'
import { API_URL } from './constants'

export const headers = {
  Authorization: localStorage.getItem('jwt_token', null),
  'Content-Type': 'application/json'
}

export const composeValidators = (...validators) => (value, allValues) =>
  validators.reduce((error, validator) => error || validator(value, allValues), undefined)

export const useFetchAsyncOptions = async (option_name, setState) => {
  const query = qs.stringify({ option_name: option_name })
  const res = await fetch(
    `${API_URL}/options?${query}`,
    {
      method: 'GET',
      headers
    }
  )

  const data = await responseHandling(res)

  setState(
    get(
      data,
      'response[0].option_value'
    )
  )
}
