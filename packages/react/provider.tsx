import { useEffect, useState, useMemo } from "react";
import React from "react";
import { ContentItemContext, ContentItem } from "./content-item";
import { Client } from "./client";
import { useAsync } from "./use-async";
import { GlobalUi } from './global-ui'

export const CmsAdmin = ({ authProvider, endpoint, children }) => {
  const [authState, setAuthState] = useState()
  useEffect(() => {
    const checkLogin = async () => {
      const token = await authProvider.init()
      setAuthState({ token })
    }

    checkLogin()
  }, [authProvider])

  if (!authState) {
    return null
  }

  if (!authState.token) {
    return <authProvider.loginUi onLogin={setAuthState} />
  }

  return (
    <CmsController token={authState.token} endpoint={endpoint}>
      {children}
    </CmsController>
  )
}

export const CmsDisplay = ({ children, data }) => (
  <ContentItemContext.Provider value={new ContentItem(data)}>
    {children}
  </ContentItemContext.Provider>
)

const CmsController = ({ token, endpoint, children }) => {
  const client = useMemo(() => new Client(endpoint, token), [endpoint, token])
  const revision = useAsync(() => client.getRevision(), [client])
  const contentItem = useMemo(() => {
    if (!revision) {
      return undefined
    }

    if (revision.value) {
      return ContentItem.fromRevision(revision.value)
    } else {
      return new ContentItem()
    }

  }, [revision])

  if (!contentItem) {
    return null
  }

  return (
    <ContentItemContext.Provider value={contentItem}>
      <GlobalUi revision={revision.value} onPublish={async () =>{
        const revision = await client.createRevision(contentItem.toRevision())
        await client.publishRevision(revision.id)
      }} />
      {children}
    </ContentItemContext.Provider>
  )
}
