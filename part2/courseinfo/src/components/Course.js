import React from 'react'

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
        <Part key={part.id} name={part.name} exercise={part.exercises}/>
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

export default Course