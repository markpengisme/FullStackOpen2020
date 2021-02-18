import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistics = ({statistics}) => {

  if (statistics.all == 0) {
    return (
      <>
      <h2>Statistics</h2>
      <p>No feedback given</p>
      </>
    )
  } else {
    return (
        <>
        <h2>Statistics</h2>
        <p>Good: {statistics.good}</p>
        <p>Neutral: {statistics.neutral}</p>
        <p>Bad: {statistics.bad}</p>
        <p>All: {statistics.all}</p>
        <p>Average: {statistics.ave} </p>
        <p>Postive: {statistics.postive}%</p>
        </>
    )
  }
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const statistics = {
    good: good,
    neutral: neutral,
    bad: bad,
    all: good + neutral + bad,
    ave: good * 1 + neutral * 0 + bad * -1,
    postive: good / ( good + neutral + bad )
  }

  const handleGoodClick = () => {
    setGood(good + 1)
  }
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }
  const handleBadClick = () => {
    setBad(bad + 1)
  }


  return (
    <div>
      <h1>Give FeedBack</h1>
      <button onClick={handleGoodClick}>Good</button>
      <button onClick={handleNeutralClick}>Neutral</button>
      <button onClick={handleBadClick}>Bad</button>
      <Statistics statistics={statistics}/>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)