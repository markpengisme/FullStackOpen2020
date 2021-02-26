import React, { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ message, setMessage] = useState({})

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
      // update
      const ans = window.confirm(`${found.name} is aready added to phonebook, replace the order number with a new one?`)
      if (ans === true) {
        const attrObj = {number: personObject.number}
        personService.update(found.id, attrObj)
        .then(returnedPerson => {
          showMessage(`Change ${returnedPerson.name}'s number`, 'green')
          setPersons(persons.map(person =>
          person.id !== returnedPerson.id 
          ? person 
          : returnedPerson))
        })
        .catch(error => {
          showMessage(`'${found.name}' was already removed from server`, 'red')
          setPersons(persons.filter(p => p.id !== found.id))
        })
      }
    } else {
      // add
      personService.create(personObject)
      .then(returnedPerson => {
        showMessage(`Added ${returnedPerson.name}`, 'green')
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
      // delete
      personService.del(found.id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== found.id))
        showMessage(`Deleted ${found.name}`, 'red')
        setNewName('')
        setNewNumber('')
      }).catch(error => {
        showMessage(`'${found.name}' was already removed from server`, 'red')
        setPersons(persons.filter(p => p.id !== found.id))
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
  
  const showMessage = (text, color) => {
    setMessage({text: text, color: color})
    setTimeout(() => {
      setMessage({})
    }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
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