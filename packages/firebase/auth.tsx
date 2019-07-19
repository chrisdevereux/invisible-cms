import { CmsAuthProvider } from '@invisiblecms/core'
import React from 'react';
import * as firebase from 'firebase'
import * as firebaseui from 'firebaseui';
import { StyledFirebaseAuth } from 'react-firebaseui'

interface FirebaseCmsAuthProps {
  signInOptions?: firebaseui.auth.Config['signInOptions']
  firebaseConfig: object
}

export default class FirebaseCmsAuth implements CmsAuthProvider {
  constructor(private props: FirebaseCmsAuthProps) {
    Object.assign(this, { props })
    firebase.initializeApp(props.firebaseConfig)
  }

  loginUi = ({ onLogin }) => (
    <div style={{ width: '100vw', height: '100vh', background: 'lightgrey', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <StyledFirebaseAuth
        uiConfig={{
          signInOptions: this.props.signInOptions || [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
          ],
          callbacks: {
            signInSuccessWithAuthResult: () => {
              const handleResult = async () => {
                onLogin(await this.init())
              }

              handleResult()
              return false
            }
          }
        }}
        firebaseAuth={firebase.auth()}
      />
    </div>
  )

  async init() {
    const user = await this.getUser()
    const tokenResult = user && await user.getIdTokenResult()

    return tokenResult && tokenResult.token
  }

  private async getUser() {
    return new Promise<firebase.User>(resolve => {
      firebase.auth().onAuthStateChanged(resolve)
    })
  }
}
