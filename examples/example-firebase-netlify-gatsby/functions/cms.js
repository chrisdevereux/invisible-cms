const serverless = require('serverless-http')
const { createCms } = require('@invisible-cms/express')
const { FirebaseCmsBackend } = require('@invisible-cms/firebase')
const { NetlifyCmsDeployTarget } = require('@invisible-cms/netlify')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIAL)),
  databaseURL: "https://cms-test-688e5.firebaseio.com"
})

exports.handler = serverless(
  createCms({
    prefix: '/cms',
    backend: new FirebaseCmsBackend(),
    target: new NetlifyCmsDeployTarget(process.env.NETLIFY_DEPLOY_HOOK)
  })
)
