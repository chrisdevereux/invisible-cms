import { Client } from '@invisible-cms/react'
import * as path from 'path'
import { GatsbyAppConfig, GatsbyPrefetchConfig } from './interfaces';
import { getResource } from '@invisible-cms/react';

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
const cache = new Map()

const resolvePath = (path: string | ((x: {}) => string), data: {}) => {
  if (typeof path === 'function') {
    return path(data)
  }

  return path
}

export const onPreInit = (_: never, configSettings: GatsbyAppConfig) => {
  config = configSettings
}

export const createPages = async ({ actions }: SourceOpts, { endpoint, token, pages }: GatsbyAppConfig) => {
  const { createPage } = actions
  const client = new Client(endpoint, token)

  try {
    for (const { id, path, component, resource, q = {}, prefetch } of pages) {
      const revision = await client.getPublishedPageRevision(id)

      const createPageForPageDef = ({ concretePath, resourceData, resourceUrl }: {concretePath: string, resourceData: {}, resourceUrl?: string}) => {
        createPage({
          component,
          context: {
            pageId: id,
            content: revision && revision.content || {},
            resourceData,
            resourceUrl
          },
          path: concretePath
        })
      }

      // Fetch, cache and return a data dependency for a page
      const resolvePrefetch = async ({ resource, q = {} }, ctx = {}) => {
        const pageData: Record<string, {}> = {}
        const resolvedQ = typeof q === 'function' ? q(ctx) : q
        if (!resolvedQ) {
          throw Error('Your prefetch query returned undefined. Did you forget to wrap an object returned from a lambda in parentheses?')
        }

        const url = resource.url(resolvedQ)
        if (!url) {
          throw Error(resource.name + '#url returned undefined')
        }

        const resourceData = await getResource(resource, url, cache)
        pageData[resource.url(resolvedQ)] = resourceData

        for (const [url, nData] of resource.normalize(resourceData)) {
          pageData[url] = nData
        }

        return pageData
      }

      // Fetch, cache and return the merged ressults from an array of data dependencies for a page
      // fetches in serial to avoid DOSing a backend.
      const resolveEachPrefetch = async (config: GatsbyPrefetchConfig[] = [], ctx = {}) => {
        const res = {}

        for (const c of config) {
          Object.assign(res, await resolvePrefetch(c, ctx))
        }

        return res
      }

      if (resource) {
        // Data dependencies retrieved from the base url
        const pageData = await resolvePrefetch({ resource, q })

        // Page backing resource data
        const pageResource = await getResource(resource, resource.url(q), cache)

        if (Array.isArray(pageResource)) {
          // If page is backed by a list resource, create a page for every resource
          for (const pageResourceItem of pageResource) {
            createPageForPageDef({
              concretePath: resolvePath(path, { ...q, ...pageResourceItem}),
              resourceData: { ...pageData, ...pageResourceItem, ...resolveEachPrefetch(prefetch, pageResourceItem) },
              resourceUrl: resource.urlFromData && resource.urlFromData(pageResourceItem)
            })
          }

        } else {
          // If page is backed by a get resource, create a single page
          createPageForPageDef({
            concretePath: resolvePath(path, { ...q, ...pageResource }),
            resourceData: { ...pageData, ...resolveEachPrefetch(prefetch, pageResource) },
            resourceUrl: resource.urlFromData && resource.urlFromData(pageResource)
          })
        }

      } else {
        // If page is not backed by a get resource, create a single page
        createPageForPageDef({ concretePath: resolvePath(path, {}), resourceData: await resolveEachPrefetch(prefetch) })
      }
    }

  } catch (error) {
    console.error(error)
    process.exit(1)
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
