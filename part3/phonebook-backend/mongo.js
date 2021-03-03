require('dotenv').config()
const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
} 

const DB_PASSWORD = process.argv[2]
const url = process.env["DB_PREFIX"] +
            process.env["DB_USER"] +
            DB_PASSWORD +
            process.env["DB_CLUSTER"]

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
