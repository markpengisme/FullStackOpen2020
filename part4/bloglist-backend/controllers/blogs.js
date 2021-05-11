const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const user = await User.findOne({})
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.patch('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        likes: body.likes,
    }
    const opts = { new: true, runValidators: true }
    const updatedPerson = await Blog.findByIdAndUpdate(request.params.id, blog, opts)
    response.json(updatedPerson)
})

module.exports = blogsRouter
