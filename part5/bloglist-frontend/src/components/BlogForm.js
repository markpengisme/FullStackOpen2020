const BlogForm = ({createBlog, newBlog, setNewBlog}) => {
    return (
        <form onSubmit={createBlog}>
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