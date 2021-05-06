const Blog = require('../models/blog')

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

module.exports = {
    initialBlogs,
}
