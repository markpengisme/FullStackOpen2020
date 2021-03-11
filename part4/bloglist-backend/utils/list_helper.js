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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}