/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ReactNode, createContext, PropsWithChildren } from 'react'
import { fromPairs, compact } from 'lodash';
import { Resource } from './resource';

export interface ResourceCache extends Map<string, any> {
  offline?: boolean
  rootResourceUrl?: string
}

export const CacheContext = createContext<ResourceCache | undefined>(undefined)

interface ResourceCacheProps {
  initialData: {}
  children?: ReactNode
  offline?: boolean
  rootResourceUrl?: string
}

export const ResourceCacheProvider = ({
  initialData,
  children,
  offline,
  rootResourceUrl
}: ResourceCacheProps) => (
  <CacheContext.Provider
    value={Object.assign(new Map(Object.entries(initialData)), { offline, rootResourceUrl })}
  >
    {children}
  </CacheContext.Provider>
)

type MockResource<T = {}, Q = {}> = { resource: Resource<T, Q>, q?: Q, value: T }

interface MockResourceCacheProps {
  root?: MockResource
  mocks?: MockResource[]
}

export const MockResourceCache = ({
  root,
  mocks = [],
  children
}: PropsWithChildren<MockResourceCacheProps>) => {
  const mockData = fromPairs(
    compact([root, ...mocks]).map(({ value, q = value, resource }) => [resource.urlFromData(q), value])
  )

  return (
    <ResourceCacheProvider offline initialData={mockData} rootResourceUrl={root && root[0].urlFromData(root[1])}>
      {children}
    </ResourceCacheProvider>
  )
}
