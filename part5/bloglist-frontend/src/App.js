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
            <BlogForm createBlog={createBlog} />
        </Togglable>
    )

    const blogsElement = () => {
        console.log(blogs)
        return blogs.map((blog) => (
            <Blog
                key={blog.id}
                blog={blog}
                increaseBlogLikes={increaseBlogLikes}
                removeBlog={removeBlog}
            />
        ))
    }

    useEffect(() => {
        blogService
            .getAll()
            .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
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

    const createBlog = async (newBlog) => {
        try {
            const blog = await blogService.create(newBlog)
            blogFormRef.current.toggleVisibility()
            setBlogs(blogs.concat(blog).sort((a, b) => b.likes - a.likes))
            showMessage(
                `a new blog "${blog.title}" is created by ${blog.author}!`,
                'green'
            )
        } catch (exception) {
            showMessage('Create error!', 'red')
        }
    }

    const removeBlog = async (id) => {
        try {
            const blog = blogs.find((blog) => blog.id === id)
            if (
                window.confirm(
                    `remove blog "${blog.title}" by ${blog.author}!`
                )
            ) {
                await blogService.remove(id)
                setBlogs(
                    blogs
                        .filter((blog) => blog.id !== id)
                        .sort((a, b) => b.likes - a.likes)
                )
            }
        } catch (exception) {
            showMessage('Create error!', 'red')
        }
    }

    const increaseBlogLikes = async (id, likesObject) => {
        try {
            const returnedBlog = await blogService.patch(id, likesObject)
            setBlogs(
                blogs
                    .map((blog) => (blog.id !== id ? blog : returnedBlog))
                    .sort((a, b) => b.likes - a.likes)
            )
        } catch (exception) {
            showMessage('increase likes error!', 'red')
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
                <p>{user.name} logged-in</p>
                <Notification message={message} />
                <button onClick={handleLogout}>logout</button>
                {blogForm()}
                {blogsElement()}
            </div>
        )
    }
}

export default App
