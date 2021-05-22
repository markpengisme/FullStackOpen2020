import React, { useState } from 'react'

const Blog = ({ blog }) => {
    const [visible, setVisible] = useState(false)
    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
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
                    {blog.title}<br></br>
                    {blog.url}<br></br>
                    likes: {blog.likes}<button>like</button><br></br>
                    {blog.author}<br></br>
                    <button onClick={toggleVisibility}>hide</button>
                </div>
            </div>
        </div>
    )
}

export default Blog
