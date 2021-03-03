require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

let notes = [
    {
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
]

!(async () => {  
    await Note.insertMany(notes).then(result => {
        console.log('---- note saved! ----')
        console.log(result)
    })

    await Note.find({}).then(result => {
        console.log('---- find all -------')
        result.forEach(note => {
            console.log(note)
        })
    })

    await Note.find({ important: true }).then(result => {
        console.log('---- find important = true ----')
        result.forEach(note => {
            console.log(note)
        })
    })
    mongoose.connection.close()
})()