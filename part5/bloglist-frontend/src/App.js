import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [message, setMessage] = useState({})
    const [user, setUser] = useState(null)
    const blogFormRef = useRef()

    const loginForm = () => (
        <Togglable buttonLabel="login">
            <LoginForm handleLogin={handleLogin} />
        </Togglable>
    )

    const blogForm = () => (
        <Togglable buttonLabel="new note" ref={blogFormRef}>
            <BlogForm
                createBlog={createBlog}
            />
        </Togglable>
    )

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs))
    }, [])

    useEffect(() => {
        const loggedUser = window.localStorage.getItem('loggedUser')
        if (loggedUser) {
            const user = JSON.parse(loggedUser)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const showMessage = (text, color) => {
        setMessage({ text, color })
        setTimeout(() => {
            setMessage({})
        }, 5000)
    }

    const createBlog = async ({newBlog}) => {
        try {
            const blog = await blogService.create(newBlog)
            blogFormRef.current.toggleVisibility()
            setBlogs(blogs.concat(blog))
            showMessage(
                `a new blog "${blog.title}" is created by ${blog.author}!`,
                'green'
            )
        } catch (exception) {
            showMessage('Create error!', 'red')
        }
    }

    const handleLogin = async ({ username, password }) => {
        try {
            const user = await loginService.login({
                username,
                password,
            })
            window.localStorage.setItem('loggedUser', JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)
        } catch (exception) {
            showMessage('Wrong credentials!', 'red')
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        window.localStorage.removeItem('loggedUser')
        blogService.setToken(null)
        setUser(null)
    }

    if (user === null) {
        return (
            <div>
                <h2>Log in to application</h2>
                <Notification message={message} />
                {loginForm()}
            </div>
        )
    } else {
        return (
            <div>
                <h2>blogs</h2>
                <Notification message={message} />
                <button onClick={handleLogout}>logout</button>
                {blogForm()}
                {blogs.map((blog) => (
                    <Blog key={blog.id} blog={blog} />
                ))}
            </div>
        )
    }
}

export default App
