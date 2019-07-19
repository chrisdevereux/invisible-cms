import {  CmsRevision, CmsRevisionProps } from "@invisiblecms/core"
import fetch from 'isomorphic-fetch'

export class Client {
  constructor(private endpoint: string, private token: string) {}

  publishRevision(id: string): Promise<void> {
    return this.request('POST', '/revision/' + id + '/publish')
  }

  getRevision(id: string = 'latest'): Promise<CmsRevision | undefined> {
    return this.request('GET', '/revision/' + id)
  }

  getPublishedRevision(): Promise<CmsRevision | undefined> {
    return this.request('GET', '/current-content')
  }

  createRevision(revision: CmsRevisionProps): Promise<CmsRevision> {
    return this.request('POST', '/revision', revision)
  }

  private async request(method: string, path: string, body?: object) {
    const res = await fetch(this.endpoint + path, {
      method,
      body: body && JSON.stringify(body),
      headers: {
        'Authorization': 'Bearer ' + this.token,
        ...body ?{ 'Content-Type': 'application/json'} : undefined
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
