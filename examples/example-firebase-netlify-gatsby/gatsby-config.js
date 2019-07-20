const firebase = require('firebase')

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-invisible-cms',
      options: {
        admin: JSON.parse(process.env.CMS_ADMIN || 'false'),
        endpoint: process.env.CMS_ENDPOINT,
        auth: '@invisible-cms/firebase/auth',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        firebaseConfig: {
          apiKey: "AIzaSyDatyZ4xaqNI35dzESTIC412ZtxaBO-ORQ",
          authDomain: "cms-test-688e5.firebaseapp.com",
        },
        pages: [
          {
            path: '/',
            component: require.resolve('./src/templates/home.tsx')
          }
        ]
      },
    },
    `gatsby-plugin-typescript`,
  ]
}