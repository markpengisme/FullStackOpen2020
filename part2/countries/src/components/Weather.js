import React from 'react'

const Weather = ({ capital, weather, getWeather }) => {
  console.log(weather)

  if (weather[capital] === undefined) {
    getWeather(capital)
    return null
  } else if(weather[capital].current !== undefined) {
    const data = weather[capital].current

    return (
      <div>
        <h3>Weather in {capital}</h3>
        <img src={data.weather_icons} alt="Loading..." />
        <p>Observation time: {data.observation_time}</p>
        <p>Temperature: {data.temperature} Celcius</p>
        <p>Humidity: {data.humidity} %</p>
      </div>
    );
  } else {
    return (
      <div>
        <h3>Weather</h3>
        <p>The weather is temporarily unavailable.</p>
      </div>
    )
  }
}

export default Weather;



