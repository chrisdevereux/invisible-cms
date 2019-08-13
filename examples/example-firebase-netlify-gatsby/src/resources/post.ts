import { resource } from '@invisible-cms/react'

export class BlogPost {
  static resource = resource('https://jsonplaceholder.typicode.com', BlogPost, ({ id }) => 'https://jsonplaceholder.typicode.com/posts/' + id)
  static list = BlogPost.resource.createList('/posts')
  static get = BlogPost.resource.createGet<{ id: string }>('/posts/:id')

  id!: string
  title!: string
}

export class BlogPostComment {
  static resource = resource('https://jsonplaceholder.typicode.com', BlogPostComment, ({ id }) => 'https://jsonplaceholder.typicode.com/comments/' + id)
  static list = BlogPostComment.resource.createList('/comments')
  static get = BlogPostComment.resource.createGet<{ id: string }>('/comments/:id')
  static forPost = BlogPostComment.resource.createList<{ postId: string }>('/posts/:postId/comments')

  id!: string
  title!: string
}
