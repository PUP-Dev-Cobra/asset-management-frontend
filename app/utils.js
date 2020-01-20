export const headers = {
  Authorization: localStorage.getItem('jwt_token', null),
  'Content-Type': 'application/json'
}

export const composeValidators = (...validators) => (value, allValues) =>
  validators.reduce((error, validator) => error || validator(value, allValues), undefined)
