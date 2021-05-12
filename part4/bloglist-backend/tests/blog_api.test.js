const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')

beforeAll(async () => {
    await User.deleteMany({})
    await helper.setUser(helper.initUser)
    await helper.setUser(helper.testUser)
})

beforeEach(async () => {
    await Blog.deleteMany({})
    const user = await User.findOne({ username: helper.initUser.username })
    const blogObjects = helper.initialBlogs.map((blog) => {
        blog.user = user._id
        return new Blog(blog)
    })
    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)
})

describe('Test GET', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('all blogs have id property', async () => {
        const response = await api.get('/api/blogs')
        response.body.map((blog) => expect(blog.id).toBeDefined())
    })
})

describe('Test POST', () => {
    test('succeeds with valid data', async () => {
        const user = await User.findOne({ username: helper.testUser.username })
        const token = await helper.getToken(user)

        const newBlog = {
            title: 'Google.com',
            author: 'doodle',
            url: 'google.com',
            likes: 10101,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization','bearer ' + token)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map((b) => b.title)
        expect(titles).toContain('Google.com')
    })

    test('succeeds with missing "likes" field', async () => {
        const user = await User.findOne({ username: helper.testUser.username })
        const token = await helper.getToken(user)

        const newBlog = {
            title: 'Google.com',
            author: 'doodle',
            url: 'google.com',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization','bearer ' + token)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const blog = blogsAtEnd.find((b) => b.title === 'Google.com')
        expect(blog.likes).toEqual(0)
    })

    test('fails with status code 400 if data invaild', async () => {
        const user = await User.findOne({ username: helper.testUser.username })
        const token = await helper.getToken(user)

        const newBlog = {
            author: 'doodle',
            url: 'google.com',
            likes: 999,
        }

        const a = await api.post('/api/blogs')
            .send(newBlog)
            .set('Authorization','bearer ' + token)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

describe('Test DELETE', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const user = await User.findOne({ username: helper.initUser.username })
        const token = await helper.getToken(user)
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api.delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization','bearer ' + token)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const title = blogsAtEnd.map(b => b.title)
        expect(title).not.toContain(blogToDelete.title)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
        const user = await User.findOne({ username: helper.initUser.username })
        const token = await helper.getToken(user)
        const invalidId = '123456789abcdefg'

        await api.delete(`/api/blogs/${invalidId}`)
            .set('Authorization','bearer ' + token)
            .expect(400)
    })

    test('fails with statuscode 401 if token is missing', async () => {
        const blogsAtStart = await helper.blogsInDb()
        await api.delete(`/api/blogs/${blogsAtStart[0].id}`)
            .expect(401)
    })

    test('fails with statuscode 403 if no permission to operate', async () => {
        const user = await User.findOne({ username: helper.testUser.username })
        const token = await helper.getToken(user)
        const blogsAtStart = await helper.blogsInDb()
        await api.delete(`/api/blogs/${blogsAtStart[0].id}`)
            .set('Authorization','bearer ' + token)
            .expect(403)
    })
})

describe('Test PATCH', () => {
    test('succeds with status code 200 if id is valid', async () => {
        const user = await User.findOne({ username: helper.initUser.username })
        const token = await helper.getToken(user)
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const newLikes = {
            likes: 99999,
        }

        await api
            .patch(`/api/blogs/${blogToUpdate.id}`)
            .send(newLikes)
            .set('Authorization','bearer ' + token)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const blog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

        expect(blog.likes).toEqual(newLikes.likes)
    })

    test('fails with statuscode 400 id is invalid', async () => {
        const user = await User.findOne({ username: helper.initUser.username })
        const token = await helper.getToken(user)
        const invalidId = '123456789abcdefg'
        const newLikes = {
            likes: 99999,
        }

        await api
            .patch(`/api/blogs/${invalidId}`)
            .send(newLikes)
            .set('Authorization','bearer ' + token)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
