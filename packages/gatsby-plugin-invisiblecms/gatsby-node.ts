import { Client } from '@invisiblecms/react'
import * as path from 'path'

interface GatsbyNode {
  id: string
  parent: string | null
  children: string[]
  internal: {
    mediaType?: string
    type: string
    content?: string
    contentDigest: string
    description?: string
  }
}

interface GatsbyPage {
  path: string
  component: string
  context: {}
}

interface SourceOpts {
  actions: {
    createNode(node: GatsbyNode): Promise<void>
    createPage(node: GatsbyPage): void
  }
}

let authProviderPath: string = ''

export const onPreInit = (_: never, { auth }) => {
  console.log({ auth })
  authProviderPath = auth.startsWith('.') ? path.resolve(auth) : require.resolve(auth)
}

export const createPages = async ({ actions }: SourceOpts, { endpoint, token, pages }) => {
  const { createPage } = actions
  const client = new Client(endpoint, token)

  const revision = await client.getPublishedRevision()

  for (const page of pages) {
    createPage({
      component: page.component,
      context: revision && revision.content || {},
      path: page.path
    })
  }
}

export const onCreateWebpackConfig = ({ actions, plugins }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        INVISIBLECMS_AUTH_PROVIDER_PATH: JSON.stringify(authProviderPath),
      }),
    ],
  })
}
