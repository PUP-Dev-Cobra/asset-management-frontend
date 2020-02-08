// general input validations
export const required = value =>
  value || typeof value === 'number' ? undefined : 'Required'

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
export const maxLength15 = maxLength(15)

const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined
export const minLength4 = minLength(4)

export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined

export const number = value => (value && isNaN(value) ? 'Number' : undefined)

export const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined

export const date = value =>
  value &&
  !/^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(value)
    ? 'Must be a valid date'
    : undefined

// * verify if value is in our `ID` format
export const identifier = value =>
  value &&
  !/^([A-Z0-9.-]{8})+-([A-Z0-9.-]{4})+-([A-Z0-9.-]{4})+-([A-Z0-9.-]{4})+-([A-Z0-9.-]{12})$/i.test(
    value
  )
    ? 'Required'
    : undefined

export const isMatchPassword = (v, allValues) => {
  return v !== allValues.password ? 'Password must match' : null
}

export const requiredNotZero = value =>
  value ? undefined : 'Required'

export const passwordMinLen = value =>
  value.length < 8 ? 'Min of 8 characters' : undefined
