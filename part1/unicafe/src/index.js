import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({onClick, text}) => (
  <button onClick={onClick}>{text}</button>
)

const Statistic = ({text , value}) => (
    <p>{text}: {value}</p>
)
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
        <Statistic text="Good" value={statistics.good} />
        <Statistic text="Neutral" value={statistics.neutral} />
        <Statistic text="Bad" value={statistics.bad} />
        <Statistic text="All" value={statistics.all} />
        <Statistic text="Average" value={statistics.ave } />
        <Statistic text="Postive" value={statistics.postive + '%'} />
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
      <Button onClick={handleGoodClick} text='Good' />
      <Button onClick={handleNeutralClick} text='Neutral' />
      <Button onClick={handleBadClick} text='Bad' />
      <Statistics statistics={statistics}/>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)