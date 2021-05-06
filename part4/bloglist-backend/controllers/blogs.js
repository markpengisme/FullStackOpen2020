const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const savedBlog = await blog.save()
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
