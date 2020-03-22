export const decode64String = encodedString => {
  return JSON.parse(atob(encodedString.split('.')[1]))
}

export const userInfo = () => {
  const jwtToken = localStorage.getItem('jwt_token')

  if (!jwtToken) return null
  return decode64String(localStorage.getItem('jwt_token'))
}

export const simpleMemoize = fn => {
  let lastArg
  let lastResult
  return arg => {
    if (arg !== lastArg) {
      lastArg = arg
      lastResult = fn(arg)
    }
    return lastResult
  }
}
