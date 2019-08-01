import { CmsBackend, CmsRevision, CmsRevisionProps, CmsDeployTarget } from "@invisible-cms/core";
import { firestore, storage } from 'firebase-admin'
import { Readable } from "stream";
import hasha from 'hasha'
import uuid from 'uuid'
import { File, CreateWriteStreamOptions } from "@google-cloud/storage";
import { extension } from 'mime-types'

interface FirebaseCmsBackendProps {
  target: CmsDeployTarget
}

export class FirebaseCmsBackend implements CmsBackend {
  constructor(
    private props: FirebaseCmsBackendProps
  ) {
    Object.assign(this, { props })
  }

  db = firestore()
  filestore = storage()

  async putFile(file: Readable, contentType: string): Promise<{ url: string; }> {
    const extname = '.' + extension(contentType)
    const bucketname = this.filestore.bucket().name

    const [hash, fileRef] = await Promise.all([
      hasha.fromStream(file, { algorithm: 'md5' }),
      this.uploadFile('tmp_' + uuid() + extname, file, {
        contentType,
        public: true
      })
    ])
    const filename = hash + extname
    await fileRef.move(filename)

    return {
      url: `https://firebasestorage.googleapis.com/v0/b/${bucketname}/o/${filename}?alt=media`
    }
  }

  async createPageRevision(page: string, props: CmsRevisionProps): Promise<CmsRevision> {
    const data = this.toRevision(props)
    const record = await this.revisions(page).add(data)

    return {
      ...data,
      id: record.id
    }
  }

  async getPageRevision(page: string, id?: string): Promise<any> {
    if (id) {
      const snapshot = await this.revisions(page).doc(id).get()
      return snapshot && {
        id: snapshot.id,
        ...snapshot.data() as any,
      }

    } else {
      const querySnapshot = await this.revisions(page).orderBy('timestamp', 'desc').limit(1).get()
      const snapshot = first(querySnapshot.docs)

      return snapshot && {
        id: snapshot.id,
        ...snapshot.data() as any,
      }
    }
  }

  async putPageRevision(page: string, revisionId: string, props: CmsRevisionProps): Promise<CmsRevision> {
    const data = this.toRevision(props)
    await this.revisions(page).doc(revisionId).update(data)

    return {
      id: revisionId,
      ...data
    }
  }

  async getPublishedPageRevision(page: string): Promise<CmsRevision> {
    const querySnapshot = await this.deployments(page).orderBy('timestamp', 'desc').limit(1).get()
    const mostRecent = first(querySnapshot.docs)

    return mostRecent.data() as CmsRevision
  }

  async publish(page: string, revisionId: string) {
    await this.deployments(page).add({ revisionId, timestamp: Date.now() })
    await this.props.target.publish()
  }

  private toRevision(props: CmsRevisionProps): Omit<CmsRevision, 'id'> {
    return {
      ...props,
      timestamp: Date.now()
    }
  }

  private revisions(page: string) {
    return this.db.collection('page.revision:' + page)
  }

  private deployments(page: string) {
    return this.db.collection('page.deployment:' + page)
  }

  private uploadFile(name: string, data: Readable, opts: CreateWriteStreamOptions = {}) {
    const fileRef = this.filestore.bucket().file(name)
    const stream = fileRef.createWriteStream(opts)

    const result = new Promise<File>((resolve, reject) => {
      stream.on('error', (err) => {
        reject(err)
      });

      stream.on('finish', async () => {
        resolve(fileRef)
      })
    })

    data.pipe(stream)
    return result
  }
}

const first = <T>(x: T[] | null) => x && x[0]

