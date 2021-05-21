import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { prettyDOM } from '@testing-library/dom'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
    const blog = {
        title: 'Example.com',
        author: 'Mark',
        url: 'example.com',
    }

    const createBlog = jest.fn()
    const component = render(<BlogForm createBlog={createBlog} />)

    const title = component.container.querySelector('input[name=Title]')
    const author = component.container.querySelector('input[name=Author]')
    const url = component.container.querySelector('input[name=URL]')
    const form = component.container.querySelector('form')
    fireEvent.change(title, { target: { value: blog.title } })
    fireEvent.change(author, { target: { value: blog.author } })
    fireEvent.change(url, { target: { value: blog.url } })
    console.log(prettyDOM(title))

    fireEvent.submit(form)
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual(blog)
})
