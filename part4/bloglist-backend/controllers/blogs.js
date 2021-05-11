const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userExtractor = require('../utils/middleware').userExtractor

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findOne({ _id: request.params.id })

    if (!blog){
        return response.status(404).json({ error: 'Blog not found' })
    }
    if (user._id.toString() !== blog.user.toString()){
        return response.status(403).json({ error: 'No permission to operate' })
    }

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
