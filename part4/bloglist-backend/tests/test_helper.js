const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Example.com',
        author: 'Mark',
        url: 'example.com',
        likes: 87,
    },
    {
        title: 'Github',
        author: 'git',
        url: 'github.com',
        likes: 123,
    },
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

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    testUser,
    setUser,
    blogsInDb,
    usersInDb
}
