import React, { useState } from 'react'

const Blog = ({ blog, increaseBlogLikes, removeBlog }) => {
    const [visible, setVisible] = useState(true)
    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const likesBtnOnClick = (id, likes) => {
        const likesObject = {
            likes: likes + 1,
        }
        increaseBlogLikes(id, likesObject)
    }
    const toggleVisibility = () => {
        setVisible(!visible)
    }
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
    }

    return (
        <div>
            <div style={hideWhenVisible}>
                <div style={blogStyle}>
                    {blog.title}
                    <button onClick={toggleVisibility}>view</button>
                </div>
            </div>
            <div style={showWhenVisible}>
                <div style={blogStyle}>
                    {blog.title}
                    <br></br>
                    {blog.url}
                    <br></br>
                    likes: {blog.likes}
                    <button
                        onClick={() => likesBtnOnClick(blog.id, blog.likes)}
                    >
                        like
                    </button>
                    <br></br>
                    {blog.author}
                    <br></br>
                    <button onClick={toggleVisibility}>hide</button>
                    <button onClick={() => removeBlog(blog.id)}>remove</button>
                </div>
            </div>
        </div>
    )
}

export default Blog
