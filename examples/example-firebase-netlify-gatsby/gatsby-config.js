require('ts-node').register({ transpileOnly: true })
require('dotenv').config()
const firebase = require('firebase')

const { BlogPost, BlogPostComment } = require('./src/resources/post')

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-invisible-cms',
      options: {
        admin: JSON.parse(process.env.CMS_ADMIN || 'false'),
        endpoint: process.env.CMS_ENDPOINT,
        auth: '@invisible-cms/firebase-ui',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        firebaseConfig: JSON.parse(process.env.FIREBASE_CONFIG),
        pages: [
          {
            path: '/',
            id: 'home',
            component: require.resolve('./src/templates/home.tsx')
          },
          {
            path: '/other',
            id: 'other',
            component: require.resolve('./src/templates/other.tsx')
          },
          {
            path: '/blog',
            id: 'blog',
            component: require.resolve('./src/templates/blog.tsx'),
            prefetch: [
              { resource: BlogPost.list },
            ],
          },
          {
            path: ({ id }) => '/blog/post/' + id,
            id: 'blog',
            component: require.resolve('./src/templates/blog-post.tsx'),
            resource: BlogPost.list,
            prefetch: [
              { resource: BlogPostComment.forPost, q: ({ id }) => ({ postId: id }) },
            ],
          }
        ]
      },
    },
    `gatsby-plugin-typescript`,
  ]
}