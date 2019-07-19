import serverless from 'serverless-http'
import { createCms } from '@invisiblecms/express'
import { FirebaseCmsBackend } from '@invisiblecms/firebase'
import { NetlifyCmsDeployTarget } from '@invisiblecms/netlify'
import { initializeApp, credential } from 'firebase-admin'

initializeApp({
  credential: credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIAL)),
  databaseURL: "https://cms-test-688e5.firebaseio.com"
})

const cms = createCms({
  backend: new FirebaseCmsBackend(),
  target: new NetlifyCmsDeployTarget('http://localhost:9000/publish')
})

cms.listen(9000, () => console.log('Started on http://localhost:9000'))
