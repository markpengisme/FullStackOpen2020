import React from 'react'
import ReactDOM from 'react-dom'

const Header = ({header}) => {
  return (
    <>
      <h1>{header}</h1>
    </>
  )
}

const Part = (props) => {
  return (
    <p>
        {props.name} {props.exercise}
    </p>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      <Part name={parts[0].name} exercise={parts[0].exercises}/>
      <Part name={parts[1].name} exercise={parts[1].exercises}/>
      <Part name={parts[2].name} exercise={parts[2].exercises}/>
    </div>
  )
}

const Total = ({parts}) => {
  return (
    <>
      <p>Total of {parts[0].exercises + parts[1].exercises + parts[2].exercises} exercises</p>
    </>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header header={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts} />
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }
  return <Course course={course} />
}

ReactDOM.render(<App />, document.getElementById('root'))