import {  CmsRevision, CmsRevisionProps } from "@invisible-cms/core"
import fetch from 'isomorphic-fetch'

export class Client {
  constructor(private endpoint: string, private token: string) {}

  publishRevision(id: string): Promise<void> {
    return this.request('POST', '/revision/' + id + '/publish')
  }

  getRevision(id: string = 'latest'): Promise<CmsRevision | undefined> {
    return this.request('GET', '/revision/' + id)
  }

  putRevision(id: string, body: CmsRevisionProps): Promise<CmsRevision | undefined> {
    return this.request('PUT', '/revision/' + id, body)
  }

  putFile(image: Blob): Promise<{ url: string }> {
    const body = new FormData()
    body.set('data', image)

    return this.request('PUT', '/file', body)
  }

  getPublishedRevision(): Promise<CmsRevision | undefined> {
    return this.request('GET', '/data')
  }

  createRevision(revision: CmsRevisionProps): Promise<CmsRevision> {
    return this.request('POST', '/revision', revision)
  }

  private async request(method: string, path: string, body?: any) {
    const isJson = body && body.constructor === Object

    const res = await fetch(this.endpoint + path, {
      method,
      body: isJson ? JSON.stringify(body) : body,
      headers: {
        'Authorization': 'Bearer ' + this.token,
        ...isJson ? { 'Content-Type': 'application/json'} : undefined,
      }
    })

    if (!res.ok) {
      throw Error(await res.text())
    }

    const contentType = res.headers.get('content-type')

    if (contentType && contentType.match('application/json')) {
      return await res.json()
    }
  }
}
