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
        let e = Error('Blog not found')
        e.name = 'NotFound'
        throw e
    } else if (user._id.toString() !== blog.user.toString()){
        let e = Error('No permission to operate')
        e.name = 'Forbidden'
        throw e
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.patch('/:id', userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findOne({ _id: request.params.id })

    if (!blog){
        let e = Error('Blog not found')
        e.name = 'NotFound'
        throw e
    } else if (user._id.toString() !== blog.user.toString()){
        let e = Error('No permission to operate')
        e.name = 'Forbidden'
        throw e
    }

    const body = request.body
    const likes = {
        likes: body.likes,
    }
    const opts = { new: true, runValidators: true }
    const updatedPerson = await Blog.findByIdAndUpdate(request.params.id, likes, opts)
    response.json(updatedPerson)
})

module.exports = blogsRouter
