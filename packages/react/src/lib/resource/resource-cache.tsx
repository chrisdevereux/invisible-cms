/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ReactNode, createContext } from 'react'

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
