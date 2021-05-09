const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')


userRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

userRouter.post('/', async (request, response) => {
    const body = request.body


    if (!body.password || body.password.length < 3) {
        let e = Error('Password length is less than 3')
        e.name = 'ValidationError'
        throw e
    }
    if (!body.username || body.username.length < 3) {
        let e = Error('Username length is less than 3')
        e.name = 'ValidationError'
        throw e
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

module.exports = userRouter