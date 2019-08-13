import React, { useEffect, useState, useMemo, ReactNode } from "react";
import { Client } from "./client";
import { useAsync } from "./use-async";
import { GlobalUi } from './global-ui'
import { ConfigContext, useClient } from "./config";
import { ProvideContent } from "./content";
import { CmsAuthProvider } from "@invisible-cms/core";
import { noop } from "./util";
import { ResourceCacheProvider } from "./resource";

interface CmsAuthGuardProps {
  authProvider: CmsAuthProvider
  endpoint: string
  children?: ReactNode
}

export const CmsAdminApp = ({ authProvider, endpoint, children }: CmsAuthGuardProps) => {
  const [authState, setAuthState] = useState<{ token: string }>()
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
    <ConfigContext.Provider value={{ editable: true, client: new Client(endpoint, authState.token) }}>
      {children}
    </ConfigContext.Provider>
  )
}

interface CmsDisplayProps {
  data?: {}
  children: ReactNode
  resourceData?: {}
  rootResourceUrl?: string
}

export const CmsPage = ({ children, rootResourceUrl, data = {}, resourceData = {} }: CmsDisplayProps) => (
  <ResourceCacheProvider rootResourceUrl={rootResourceUrl} initialData={resourceData}>
    <ProvideContent value={data} editable={false} onChange={noop}>
      {children}
    </ProvideContent>
  </ResourceCacheProvider>
)

interface CmsAdminPageProps {
  children: ReactNode
  pageId: string
  resourceData: {}
  rootResourceUrl?: string
}

export const CmsAdminPage = ({ children, rootResourceUrl, pageId, resourceData }: CmsAdminPageProps) => {
  const client = useClient()
  const revision = useAsync(async () => {
    const revision = await client.getPageRevision(pageId)
    return revision || client.createPageRevision(pageId, { content: {} })
  }, [client])

  const [editValue, setEditValue] = useState()

  if (!revision) {
    return null
  }

  const save = async () => {
    if (revision.value) {
      const revisionId = revision.value.id
      revision.value = await client.putPageRevision(pageId, revisionId, { content: editValue })

    } else {
      revision.value = await client.createPageRevision(pageId, { content: editValue })
    }

    setEditValue(undefined)
  }

  return (
    <ResourceCacheProvider rootResourceUrl={rootResourceUrl} initialData={resourceData}>
      <ProvideContent editable value={editValue || revision.value.content} onChange={setEditValue}>
        <GlobalUi
          revision={revision.value}
          onPublish={async () =>{
            await save()
            await client.publish(pageId, revision.value.id)

            revision.value = await client.createPageRevision(pageId, { content: revision.value.content })
          }}
          onSave={save}
        />
        {children}
      </ProvideContent>
    </ResourceCacheProvider>
  )
}
