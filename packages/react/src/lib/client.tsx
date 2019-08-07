import {  CmsRevision, CmsRevisionProps } from "@invisible-cms/core"
import fetch from 'isomorphic-fetch'

export class Client {
  constructor(private endpoint: string, private token: string) {}

  putFile(file: Blob): Promise<{ url: string }> {
    const body = new FormData()
    body.set('data', file)

    return this.request('PUT', '/file', body)
  }

  createPageRevision(page: string, revision: CmsRevisionProps): Promise<CmsRevision> {
    return this.request('POST', '/page/' + page + '/revision/', revision)
  }

  getPageRevision(page: string, revisionId: string = 'latest'): Promise<CmsRevision | undefined> {
    return this.request('GET', '/page/' + page + '/revision/' + revisionId)
  }

  putPageRevision(page: string, revisionId: string, body: CmsRevisionProps): Promise<CmsRevision | undefined> {
    return this.request('PUT', '/page/' + page + '/revision/' + revisionId, body)
  }

  getPublishedPageRevision(page: string): Promise<CmsRevision | undefined> {
    return this.request('GET', '/page/' + page + '/revision/published')
  }

  publish(page: string, revisionId: string): Promise<void> {
    return this.request('POST', '/page/' + page + '/revision/' + revisionId + '/publish')
  }

  private async request(method: string, path: string, body?: any) {
    const isJson = body && body.constructor === Object

    const res = await fetch(this.endpoint + path, {
      method,
      body: isJson ? JSON.stringify(body) : body,
      headers: {
        ...this.token ? { 'Authorization': 'Bearer ' + this.token } : undefined,
        ...isJson ? { 'Content-Type': 'application/json'} : undefined,
      }
    })

    if (res.status === 404) {
      return undefined
    }

    if (!res.ok) {
      throw Error(await res.text())
    }

    const contentType = res.headers.get('content-type')

    if (contentType && contentType.match('application/json')) {
      return await res.json()
    }
  }
}
