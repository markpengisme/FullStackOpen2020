import React from 'react'

const Countries = ({ countriesToShow }) => {

  if (countriesToShow.length > 10) {
    return (
      <p>Too many matches, please specify another filter.</p>
    )
  } else if (countriesToShow.length > 1){
    return (
      <ul>
        {countriesToShow.map(country =>
            <li key={country.name}>{country.name}</li>
        )}
      </ul>
    )
  } else if (countriesToShow.length === 1){
    const country = countriesToShow[0]
    return(
      <>
        <h2>{country.name}</h2>
        <p>Capital: {country.capital}</p>
        <p>Population: {country.population}</p>
        <h3>Languages</h3>
        <ul>
          {country.languages.map(language =>
              <li key={language.name}>{language.name}</li>
          )}
        </ul>
        <img src={country.flag} alt="" width="100" height="100"/>
      </>
    )
  } else {
    return null
  }
}

export default Countries