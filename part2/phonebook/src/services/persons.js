import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const del = id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const update = (id, attrObj) => {
  const request = axios.patch(`${baseUrl}/${id}`, attrObj)
  return request.then(response => response.data)
}

const personService = { getAll, create, del, update }
export default personService