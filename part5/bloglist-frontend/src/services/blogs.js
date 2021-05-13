import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getToken = () => {
  console.log(token)
}

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { getToken, setToken, getAll }