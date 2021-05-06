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


const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb,
}
