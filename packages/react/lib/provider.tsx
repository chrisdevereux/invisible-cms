import { useEffect, useState, useMemo, ReactNode } from "react";
import React from "react";
import { Client } from "./client";
import { useAsync } from "./use-async";
import { GlobalUi } from './global-ui'
import { ConfigContext } from "./config";
import { ProvideContent } from "./content";
import { CmsAuthProvider } from "@invisible-cms/core";
import { noop } from "./util";

interface CmsAdminProps {
  authProvider: CmsAuthProvider
  endpoint: string
  children: ReactNode
}

export const CmsAdmin = ({ authProvider, endpoint, children }: CmsAdminProps) => {
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
    <ConfigContext.Provider value={{ editable: true }}>
      <CmsController token={authState.token} endpoint={endpoint}>
        {children}
      </CmsController>
    </ConfigContext.Provider>
  )
}

export const CmsDisplay = ({ children, data }) => (
  <ProvideContent value={data} editable={false} onChange={noop}>
    {children}
  </ProvideContent>
)

const CmsController = ({ token, endpoint, children }) => {
  const client = useMemo(() => new Client(endpoint, token), [endpoint, token])
  const revision = useAsync(() => client.getRevision(), [client])
  const [editValue, setEditValue] = useState()

  if (!revision) {
    return null
  }

  const save = async () => {
    if (revision.value) {
      const nextRevision = { ...revision.value, content: editValue }
      await client.putRevision(revision.value.id, nextRevision)
      revision.value = nextRevision

    } else {
      revision.value = await client.createRevision({ content: editValue })
    }

    setEditValue(undefined)
  }

  return (
    <ProvideContent editable value={editValue || revision.value.content} onChange={setEditValue}>
      <GlobalUi
        revision={revision.value}
        onPublish={async () =>{
          await save()
          await client.publishRevision(revision.value.id)

          revision.value = await client.createRevision(revision.value.content)
        }}
        onSave={save}
      />
      {children}
    </ProvideContent>
  )
}
