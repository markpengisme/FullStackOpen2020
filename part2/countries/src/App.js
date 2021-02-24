import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import Filter from './components/Filter'

const App = () => {
  const [ countries, setCountries] = useState([])
  const [ filter, setFilter ] = useState('')


  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(res => {
        setCountries(res.data)
      })
  }, [])

  const countriesToShow = countries.filter(country => 
    country.name.toLowerCase().includes(filter.toLowerCase())
  )

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Country</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange}></Filter>
      <div>
        <Countries countriesToShow={countriesToShow} />
      </div>
    </div>
  )
}

export default App