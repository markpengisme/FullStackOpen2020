import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}

const patch = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.patch(`${baseUrl}/${id}`, newObject, config)
  return request.then(response => response.data)
}

export default { setToken, getAll, create, patch}