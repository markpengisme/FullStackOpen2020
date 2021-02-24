import React from 'react'
import Country from './Country'
import Weather from './Weather'

const Countries = ({ countriesToShow, showCountry,
  handleShowBtnClick, weather, getWeather }) => {
  if (countriesToShow.length > 10) {
    return (
      <p>Too many matches, please specify another filter.</p>
    )
  } else if (countriesToShow.length > 1){
    return (
      <ul>
        {countriesToShow.map(country =>
            <li key={country.name}>{country.name}
              <button name={country.name} onClick={handleShowBtnClick}>
                {showCountry[country.name] ? "hide" : "show"}
              </button>
              <div id={country.name} style={{ display: 'none'}}>
                <Country country={country} />
              </div>
            </li>
        )}
      </ul>
    )
  } else if (countriesToShow.length === 1){
    const country = countriesToShow[0]
    return(
      <>
      <Country country={country} />
      <Weather capital={country.capital}
               weather={weather}
               getWeather={getWeather}/>
      </>
    )
  } else {
    return null
  }
}

export default Countries