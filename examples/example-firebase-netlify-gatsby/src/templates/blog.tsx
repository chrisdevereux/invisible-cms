import { useResource } from '@invisible-cms/react'
import React from 'react';
import { BlogPost } from '../resources/post'
import { Link } from 'gatsby'

const Blog = () => {
  const posts = useResource(BlogPost.list, {})

  if (!posts) {
    return null
  }

  return (
    <>
      {posts.value.map(val => <div key={val.id}><Link to={'/blog/post/' + val.id} key={val.id}>{val.title}</Link></div>)}
    </>
  )
}

export default Blog
