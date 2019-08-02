import { Client } from '@invisible-cms/react'
import * as path from 'path'
import { GatsbyAppConfig } from './interfaces';

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

let config: GatsbyAppConfig

export const onPreInit = (_: never, configSettings: GatsbyAppConfig) => {
  config = configSettings
}

export const createPages = async ({ actions }: SourceOpts, { endpoint, token, pages }) => {
  const { createPage } = actions
  const client = new Client(endpoint, token)

  for (const page of pages) {
    const revision = await client.getPublishedPageRevision(page.id)

    createPage({
      component: page.component,
      context: {
        pageId: page.id,
        content: revision && revision.content || {}
      },
      path: page.path
    })
  }
}

export const onCreateWebpackConfig = ({ actions, plugins }) => {
  const { auth } = config

  const authProviderPath = auth.startsWith('.') ? path.resolve(auth) : require.resolve(auth)

  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        ...config.admin ? {} : { 'process.env.REACT_APP_CMS_NOADMIN': "true" },
        INVISIBLE_CMS_AUTH_PROVIDER_PATH: JSON.stringify(authProviderPath),
      }),
    ],
  })
}
