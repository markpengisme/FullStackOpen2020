const  _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) { return {} }
  const reformatedBlogs = blogs.map( blog => {
    return {
      title: blog.title,
      author: blog.author,
      likes: blog.likes
    }
  })

  const reducer = (prev, current) => {
    return prev.likes > current.likes ? prev : current
  }
  return reformatedBlogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) { return {} }
  const mapBlogs = _.map(blogs, (blog) => {
    return {
      author: blog.author,
      blogs: 1
    }
  })

  const reducedBlogs = _.reduce(mapBlogs, (result, blog) => {
    const index = _.findIndex(result, (b) => {
      return b.author === blog.author
    })

    if (index === -1) {
      return _.concat(result, blog)
    } else {
      result[index].blogs += blog.blogs
      return result
    }
  }, {})
  return _.maxBy(reducedBlogs, function(b) { return b.blogs })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}