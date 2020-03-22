import debounce from 'lodash/debounce'

import { API_URL } from 'App/constants'
import { headers } from 'App/utils'

export const loanAllowed = (shareAmount) => {
  return value => {
    if (value > 100000) {
      return 'Loan amount should not exceed 100,000'
    } else if (value > shareAmount) {
      return "You don't have enough collateral. Minimum of 2000 is required"
    }
    return undefined
  }
}

export const loanQualified = async value => {
  if (!value) {
    return undefined
  }

  const res = await fetch(
    `${API_URL}/validations/loan-qualify/${value}`,
    {
      method: 'GET',
      headers
    }
  )

  const message = await res.json()
  if (res.status !== 200) {
    return message?.error
  }

  if (message?.response) {
    return 'This member is not qualifed to be a co-maker'
  }
}
