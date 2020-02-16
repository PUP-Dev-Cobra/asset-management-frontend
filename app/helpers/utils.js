export const decode64String = encodedString => {
  return JSON.parse(atob(encodedString.split('.')[1]))
}

export const userInfo = () => {
  return decode64String(localStorage.getItem('jwt_token'))
}
