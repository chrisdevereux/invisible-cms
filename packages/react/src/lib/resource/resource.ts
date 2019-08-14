/* eslint-disable @typescript-eslint/no-explicit-any */

import { useContext, useState, useEffect } from 'react'
import { toUrl, get } from './util'
import { CacheContext, ResourceCache } from './resource-cache'
import { constant } from 'lodash'
import { useAsync } from '../use-async';

export interface Resource<Q, T> {
  convert: (props: any) => T
  url: (q: Q) => string
  normalize: (x: T) => [string, T][]
  urlFromData?: (x: {}) => string
}

export const resource = <T, BaseQ = {}>(
  basePath: string,
  Model: new (props: {}) => T,
  normalize?: (x: T) => string,
) => ({
  createGet: <Q>(subpath: string = ''): Resource<Q & BaseQ, T> => ({
    convert: props => Object.assign(new Model(props), props),
    url: q => toUrl(basePath + subpath, q),
    normalize: normalize ? (res: any) => [normalize(res), res] : constant([]),
    urlFromData: normalize,
  }),
  createList: <Q>(subpath: string = ''): Resource<Q & BaseQ, T[]> => ({
    convert: (res: any[]) => res.map(x => Object.assign(new Model(x), x)),
    url: q => toUrl(basePath + subpath, q),
    normalize: normalize
      ? (res: any[]) => res.map(x => [normalize(x), x])
      : constant([]),
    urlFromData: normalize,
  }),
})

export const getResource = async <Q, T>(resource: Resource<Q, T>, url: string, cache: ResourceCache = new Map()): Promise<T> => {
  const cacheHit = cache.get(url)

  if (cacheHit) {
    return resource.convert(cacheHit)
  }

  const value = cache.get(url) || (await get(url))
  if (typeof value === 'undefined') {
      throw Error('Not found: ' + url)
  }

  cache.set(url, value)

  for (const [url, nData] of resource.normalize(value)) {
    cache.set(url, nData)
  }

  return resource.convert(value)
}

export const useResource = <Q, T>(resource: Resource<Q, T>, q: Q): { value: T } | undefined => {
  const cache = useContext(CacheContext)
  if (!cache) {
    throw Error('No cache found')
  }

  const url = resource.url(q)

  if (cache.offline) {
    const value = cache.get(url)
    if (!value) {
      throw Error(
        `Expected ${url} to be specified in resource cache. Found: ${Array.from(
          cache.keys(),
        )}`,
      )
    }
    return { value }
  }

  const value = useAsync(async () => getResource(resource, url, cache), [resource, url, cache])

  const [prev, setPrev] = useState<{ value: T }>()
  const acceptedValue = value || prev

  useEffect(() => {
    if (acceptedValue) {
      setPrev(acceptedValue)
    }
  }, [acceptedValue])

  return acceptedValue
}

export const usePageResource = <Q, T>(resource: Resource<Q, T>) => {
  const cache = useContext(CacheContext)

  if (!cache) {
    throw Error('No cache found')
  }

  if (!cache.rootResourceUrl) {
    throw Error('usePageResource() must be called on a page with a root resource')
  }

  const res = cache.get(cache.rootResourceUrl)

  if (typeof res === 'undefined') {
    throw Error(`Expected ${cache.rootResourceUrl} to be cached`)
  }

  return resource.convert(res)
}

export const useCachedResource = <Q, T>(resource: Resource<Q, T>, q: Q) => {
  const url = resource.url(q)
  const cache = useContext(CacheContext)
  if (!cache) {
    throw Error('No cache found')
  }

  const res = cache.get(url)

  if (typeof res === 'undefined') {
    throw Error(`Expected ${resource.url(q)} to be cached`)
  }

  return resource.convert(res)
}
