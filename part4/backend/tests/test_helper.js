const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true
  }
]

const testUser = {
  'username': 'root',
  'name': 'Superuser',
  'password': 'markpeng'
}

const setUser = async (testUser) => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash(testUser.password, 10)
  const user = new User({
    username: testUser.username,
    name: testUser.name,
    passwordHash,
  })
  const savedUser = await user.save()
  return savedUser
}

const getToken = async (user) => {
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )
  return token
}


const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon',date: new Date() })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  testUser,
  setUser,
  getToken,
  nonExistingId,
  notesInDb,
  usersInDb
}