import serverless from 'serverless-http'
import { createCms } from '@invisible-cms/express'
import { FirebaseCmsBackend } from '@invisible-cms/firebase'
import { NetlifyCmsDeployTarget } from '@invisible-cms/netlify'
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
