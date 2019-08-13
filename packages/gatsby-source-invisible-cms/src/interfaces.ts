import { Resource } from '@invisible-cms/react'

export interface GatsbyAppConfig {
  auth?: string
  admin?: boolean
  token?: string
  pages: GatsbyPageConfig[]
  endpoint: string
}

export interface GatsbyPrefetchConfig {
  resource: Resource<any, any>
  q: {}
}

interface GatsbyPageConfig extends Partial<GatsbyPrefetchConfig> {
  component: string
  id: string
  path: string | ((x: {}) => string)
  prefetch?: GatsbyPrefetchConfig[]
}
