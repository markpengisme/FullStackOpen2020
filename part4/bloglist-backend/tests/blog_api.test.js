const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
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
        const newBlog = {
            title: 'Google.com',
            author: 'doodle',
            url: 'google.com',
            likes: 10101,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map((b) => b.title)
        expect(titles).toContain('Google.com')
    })

    test('succeeds with missing "likes" field', async () => {
        const newBlog = {
            title: 'Google.com',
            author: 'doodle',
            url: 'google.com',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const blog = blogsAtEnd.find((b) => b.title === 'Google.com')
        expect(blog.likes).toEqual(0)
    })

    test('fails with status code 400 if data invaild', async () => {
        const newBlog = {
            author: 'doodle',
            url: 'google.com',
            likes: 999,
        }

        const a = await api.post('/api/blogs').send(newBlog).expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

describe('Test DELETE', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const title = blogsAtEnd.map(b => b.title)

        expect(title).not.toContain(blogToDelete.title)
    })

    test('fails with statuscode 400 id is invalid', async () => {
        const invalidId = '123456789abcdefg'

        await api.delete(`/api/blogs/${invalidId}`).expect(400)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
