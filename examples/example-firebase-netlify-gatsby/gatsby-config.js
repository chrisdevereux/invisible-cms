require('dotenv').config()
const firebase = require('firebase')

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
          }
        ]
      },
    },
    `gatsby-plugin-typescript`,
  ]
}