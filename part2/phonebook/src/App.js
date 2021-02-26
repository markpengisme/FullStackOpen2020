import React, { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/persons'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ filter, setFilter ] = useState('')

  useEffect(() => {
    personService.getAll()
    .then(allPeople => {
      setPersons(allPeople)
    })
  }, [])

  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    
    const found = persons.find(person => person.name === newName)
    if (found !== undefined) {
      const ans = window.confirm(`${found.name} is aready added to phonebook, replace the order number with a new one?`)
      if (ans === true) {
        const attrObj = {number: personObject.number}
        personService.update(found.id, attrObj)
        .then(returnedPerson => setPersons(persons.map(person =>
          person.name !== returnedPerson.name 
          ? person 
          : returnedPerson))
        )
      }
    } else {
      personService.create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
    }
  }

  const deletePerson = (event) => {
    event.preventDefault()
    const found = persons.find(person => person.id.toString() === event.target.dataset.id)
    const ans = window.confirm(`Delete ${found.name}`)
    if (ans === true){
      personService.del(found.id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== found.id))
        setNewName('')
        setNewNumber('')
      }) 
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange}></Filter>
      <h2>New</h2>
      <PersonForm addPerson={addPerson}
                  newName={newName}
                  handleNameChange={handleNameChange}
                  newNumber={newNumber}
                  handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow}
               deletePerson={deletePerson} />
    </div>
  )
}

export default App