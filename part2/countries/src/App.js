import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import Filter from './components/Filter'

const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ filter, setFilter ] = useState('')
  const [ showCountry, setShowCountry ] = useState({})


  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(res => {
        setCountries(res.data)
        
        let show = {}
        res.data.forEach(country => {
          show[country.name] = false
        })
        setShowCountry(show)
      })
  }, [])

  const countriesToShow = countries.filter(country => 
    country.name.toLowerCase().includes(filter.toLowerCase())
  )

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleShowBtnClick = (event) => {
    const name = event.target.name
    const copy = {...showCountry}
    copy[name] = !copy[name]
    document.getElementById(name).style.display = copy[name] ? "block" : "none"
    setShowCountry(copy)
  }

  return (
    <div>
      <h2>Country</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange}></Filter>
      <div>
        <Countries countriesToShow={countriesToShow}
                   showCountry={showCountry}
                   handleShowBtnClick={handleShowBtnClick} />
      </div>
    </div>
  )
}

export default App