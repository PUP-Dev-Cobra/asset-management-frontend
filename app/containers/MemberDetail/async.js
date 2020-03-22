import { API_URL } from 'App/constants'
import { headers } from 'App/utils'
import { responseHandling } from 'App/async'

export const fetchMember = async args => {
  const uuid = args.uuid || args[0].uuid
  const res = await fetch(
    `${API_URL}/member/${uuid}`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
}

export const fetchRecieptAsync = async args => {
  const res = await fetch(
    `${API_URL}/reciept/list/${args[0].uuid}`,
    {
      method: 'GET',
      headers
    }
  )
  return responseHandling(res)
}

export const payInvoiceAsync = async args => {
  const { uuid, ...values } = args[0]
  const res = await fetch(
    `${API_URL}/invoice/${uuid}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(values)
    }
  )

  return responseHandling(res)
}

export const addCollateralAsync = async args => {
  const res = await fetch(
    `${API_URL}/shares`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(args[0])
    }
  )

  return responseHandling(res)
}

export const voidInvoiceAsync = async args => {
  const { uuid, ...values } = args[0]
  const res = await fetch(
    `${API_URL}/invoice/void/${uuid}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(values)
    }
  )

  return responseHandling(res)
}

export const validateLoanQualifier = async args => {
  const { uuid } = args
  const res = await fetch(
    `${API_URL}/validations/loan-qualify/${uuid}`,
    {
      method: 'GET',
      headers
    }
  )

  return responseHandling(res)
}
