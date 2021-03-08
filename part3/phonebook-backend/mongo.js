require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', phonebookSchema)


if ( process.argv.length === 3) {
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else if ( process.argv.length === 5 ) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(result => {
    console.log('---- phonebook saved! ----')
    console.log(result)
    mongoose.connection.close()
  })
} else {
  mongoose.connection.close()
}
