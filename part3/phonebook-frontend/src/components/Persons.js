import React from 'react'

const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <ul>
        {personsToShow.map(person =>
          <form key={person.id} onSubmit={deletePerson} data-id={person.id}>
            <p>
              {person.name} {person.number}
              <button type="submit">delete</button>
            </p>
        </form> 
        )}
    </ul>
  )
}

export default Persons