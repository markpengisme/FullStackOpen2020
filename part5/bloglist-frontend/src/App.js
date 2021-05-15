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
    const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
    const [message, setMessage] = useState({})
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const blogFormRef = useRef()

    const loginForm = () => (
        <Togglable buttonLabel="login">
            <LoginForm
                handleLogin={handleLogin}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
            />
        </Togglable>
    )

    const blogForm = () => (
        <Togglable buttonLabel="new note" ref={blogFormRef}>
            <BlogForm
                createBlog={createBlog}
                newBlog={newBlog}
                setNewBlog={setNewBlog}
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

    const createBlog = async (event) => {
        event.preventDefault()
        try {
            const blog = await blogService.create(newBlog)
            blogFormRef.current.toggleVisibility()
            setBlogs(blogs.concat(blog))
            setNewBlog({ title: '', author: '', url: '' })
            showMessage(
                `a new blog "${blog.title}" is created by ${blog.author}!`,
                'green'
            )
        } catch (exception) {
            showMessage('Create error!', 'red')
        }
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username,
                password,
            })
            window.localStorage.setItem('loggedUser', JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
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
