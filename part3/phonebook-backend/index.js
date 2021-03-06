require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
// app.use(morgan(':method :url \:status :res[content-length] - :response-time ms :body'))
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ')
}))

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    let text = `<p>Phonebook has info for ${persons.length} people</p>`
    text += `<p>${Date().toString()}</p>`
    res.send(text)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'Name and number must be filled in.' 
    })
  }
  
  Person.findOne({"name":body.name}).then(person => {
    if (person) {
        return res.status(400).json({ 
          error: 'Name must be unique.' 
      })
    } else {
      const newPerson = new Person({
        name: body.name,
        number: body.number,
      })
      newPerson.save().then(savePerson => {
        res.json(savePerson)
      })
    } 
  })
})


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
