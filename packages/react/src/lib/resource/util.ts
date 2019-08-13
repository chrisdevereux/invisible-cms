import { stringify } from 'querystring'
import { size } from 'lodash'
import fetch from 'isomorphic-fetch'

export const get = async (url: string) => {
  const res = await fetch(url)

  if (res.status === 404) {
    return undefined
  }

  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res.json()
}

export const toUrl = (path: string, params: {}) => {
  const remainingParams = Object.assign({}, params)

  for (const key of Object.keys(params)) {
    if (path.includes(':' + key)) {
      if (params[key] === undefined) {
        throw Error('undefined provided as path param to ' + key + ' in ' + path + '. Did you use the right resource?')
      }

      path = path.replace(':' + key, params[key])
      delete remainingParams[key]
    }

    if (
      params[key] === undefined ||
      params[key] === null ||
      (Array.isArray(params[key]) && params[key].length === 0)
    ) {
      delete remainingParams[key]
    }
  }

  if (path.match(/:[a-zA-Z]/)) {
    throw Error('unmatched path component in ' + path)
  }

  if (size(remainingParams) === 0) {
    return path
  }

  return path + '?' + stringify(remainingParams)
}
