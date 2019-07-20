import fetch from 'node-fetch'
import { CmsDeployTarget } from '@invisible-cms/core';

export class NetlifyCmsDeployTarget implements CmsDeployTarget {
  constructor(
    private publishHook: string
  ) { }

  async publish(): Promise<void> {
    await fetch(this.publishHook, { method: 'POST' })
  }
}
