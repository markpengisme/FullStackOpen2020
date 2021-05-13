import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [newBlog, setNewBlog] = useState({})
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                <label>username</label>
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                <label>password</label>
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
        </form>
    )

    const blogForm = () => (
        <form onSubmit={createBlog}>
            <div>
                <label>title</label>
                <input
                    type="text"
                    value={newBlog.title}
                    name="Title"
                    onChange={({ target }) =>
                        setNewBlog({
                            ...newBlog,
                            title: target.value,
                        })
                    }
                />
            </div>
            <div>
                <label>author</label>
                <input
                    type="text"
                    value={newBlog.author}
                    name="Author"
                    onChange={({ target }) =>
                        setNewBlog({
                            ...newBlog,
                            author: target.value,
                        })
                    }
                />
            </div>
            <div>
                <label>url</label>
                <input
                    type="text"
                    value={newBlog.url}
                    name="URL"
                    onChange={({ target }) =>
                        setNewBlog({
                            ...newBlog,
                            url: target.value,
                        })
                    }
                />
            </div>
            <button type="submit">create</button>
        </form>
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

    const createBlog = async (event) => {
        event.preventDefault()
        try {
            const blog = await blogService.create(newBlog)
            setBlogs(blogs.concat(blog))
            setNewBlog({})
        } catch (exception) {}
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
        } catch (exception) {}
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
                {loginForm()}
            </div>
        )
    } else {
        return (
            <div>
                <h2>blogs</h2>
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
