import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './blog'

test('renders blog content', () => {
    const blog = {
        title: 'Example.com',
        author: 'Mark',
        url: 'example.com',
        likes: 87,
    }

    const component = render(<Blog blog={blog} />)
    const brief = component.container.querySelector('.brief-blog')
    const detail = component.container.querySelector('.detail-blog')
    // console.log(prettyDOM(brief))
    // console.log(prettyDOM(detail))

    expect(brief).toHaveTextContent(blog.title)
    expect(brief).not.toHaveTextContent(blog.url)

    expect(detail).toHaveStyle({ display: 'none' })
    expect(detail).toHaveTextContent(blog.title)
    expect(detail).toHaveTextContent(blog.url)
})


test('clicking the view button calls show details', () => {
    const blog = {
        title: 'Example.com',
        author: 'Mark',
        url: 'example.com',
        likes: 87,
    }

    const component = render(<Blog blog={blog} />)
    const detail = component.container.querySelector('.detail-blog')

    expect(detail).toHaveStyle({ display: 'none' })

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(detail).not.toHaveStyle({ display: 'none' })
    expect(detail).toHaveTextContent(blog.url)
    expect(detail).toHaveTextContent(blog.likes)
})
