const functions = require('firebase-functions');
const admin = require('firebase-admin')
const { createCms } = require('@invisible-cms/express')
const { FirebaseCmsBackend } = require('@invisible-cms/firebase')
const { NetlifyCmsDeployTarget } = require('@invisible-cms/netlify')

// user configuration works differently depending on whether we're running in firebase or node
const configString = (key) => process.env[key] || functions.config().cms[key.toLowerCase()]
const configObject = (key) => {
  const config = configString(key)
  return typeof config === 'string' ? JSON.parse(config) : config
}

// firebase configuration provided via process.env on firebase
const firebaseConfig = configObject('FIREBASE_CONFIG')

admin.initializeApp({
  credential: admin.credential.cert(configObject('FIREBASE_CREDENTIAL')),
  ...firebaseConfig
})

const target = new NetlifyCmsDeployTarget(configString('NETLIFY_DEPLOY_HOOK'))
const cmsService = createCms({
  backend: new FirebaseCmsBackend({ target }),
})

exports.cms = functions.https.onRequest(cmsService)
exports.cms.middleware = cmsService
