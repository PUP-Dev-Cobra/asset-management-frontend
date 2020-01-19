export const headers = {
  Authorization: localStorage.getItem('jwt_token', null),
  'Content-Type': 'application/json'
}
