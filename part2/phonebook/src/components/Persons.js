import React from 'react'

const Persons = ({ personsToShow }) => {
  return (
    <ul>
        {personsToShow.map(person =>
            <p key={person.id}>{person.name} {person.number}</p>
        )}
    </ul>
  )
}

export default Persons