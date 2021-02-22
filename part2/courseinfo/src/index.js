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
      {parts.map((part) => 
        <Part name={part.name} exercise={part.exercises}/>
      )}
    </div>
  )
}

const Total = ({parts}) => {
  const total = parts.reduce((p, s) => p + s.exercises, 0)
  
  return (
    <>
      <p>Total of {total} exercises</p>
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
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
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
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]
  return (
    <div>
      {courses.map((course) => 
        <Course key={course.id} course={course} />
      )}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))