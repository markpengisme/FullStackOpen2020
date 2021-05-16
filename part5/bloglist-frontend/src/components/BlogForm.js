import React, { useState } from 'react'
const BlogForm = ({ createBlog }) => {
    const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

    const onSubmit = (event) => {
        event.preventDefault()
        createBlog(newBlog)
        setNewBlog({ title: '', author: '', url: '' })
    }
    return (
        <form onSubmit={onSubmit}>
            <div>
                <label>title</label>
                <input
                    type="text"
                    value={newBlog.title}
                    name="Title"
                    onChange={({ target }) => {
                        setNewBlog({
                            ...newBlog,
                            title: target.value,
                        })
                    }}
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
}

export default BlogForm
