import React from 'react';
import { useResource, usePageResource } from '@invisible-cms/react'
import { BlogPost, BlogPostComment } from '../resources/post'

const Blog = () => {
  const post = usePageResource(BlogPost.get)
  const comments = useResource(BlogPostComment.forPost, { postId: post.id })

  if (!post || !comments) {
    return null
  }

  return (
    <>
      <h1>{post.title}</h1>
      {comments.value.map(comment => <div key={comment.id}>{comment.title}</div>)}
    </>
  )
}

export default Blog
