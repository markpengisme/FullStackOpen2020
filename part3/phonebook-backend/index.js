require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express()
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.log(error)
  console.log(JSON.parse(JSON.stringify(error)))

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.errors) {
    return res.status(400).send({ error: error.message })
  }

  // next(error)
  res.status(500).end()
}


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

app.get('/info', (req, res, next) => {
  Person.find({}).then(persons => {
    let text = `<p>Phonebook has info for ${persons.length} people</p>`
    text += `<p>${Date().toString()}</p>`
    res.send(text)
  }).catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name and number must be filled in.'
    })
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson.save().then(savePerson => {
    res.json(savePerson)
  }).catch(error => next(error))

})

app.patch('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    number: body.number,
  }
  const opts = { new: true, runValidators: true }
  Person.findByIdAndUpdate(req.params.id, person, opts)
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
