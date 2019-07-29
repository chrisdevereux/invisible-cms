import { CmsBackend, CmsRevision } from "@invisible-cms/core";
import { firestore, storage } from 'firebase-admin'
import { Readable, Stream } from "stream";
import hasha from 'hasha'
import uuid from 'uuid'
import { File, CreateWriteStreamOptions } from "@google-cloud/storage";
import { extension } from 'mime-types'

export class FirebaseCmsBackend implements CmsBackend {
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

  async getRevision(id?: string): Promise<CmsRevision> {
    if (id) {
      const snapshot = await this.db.collection('revision').doc(id).get()
      return snapshot && {
        id: snapshot.id,
        ...snapshot.data() as any,
      }

    } else {
      const querySnapshot = await this.db.collection('revision').orderBy('timestamp', 'desc').limit(1).get()
      const snapshot = first(querySnapshot.docs)

      return snapshot && {
        id: snapshot.id,
        ...snapshot.data() as any,
      }
    }
  }

  async createRevision(data: Omit<CmsRevision, 'id'>): Promise<CmsRevision> {
    const revision = await this.db.collection('revision').add(data)
    return {
      ...data,
      id: revision.id
    }
  }

  async putRevision({ id, ...data }: CmsRevision): Promise<void> {
    await this.db.collection('revision').doc(id).update(data)
  }

  async setPublishedRevision(id: string) {
    await this.db.collection('publish').add({ revisionId: id, timestamp: Date.now() })
  }

  async getPublishedRevisionId(): Promise<string> {
    const querySnapshot = await this.db.collection('publish').orderBy('timestamp', 'desc').limit(1).get()
    const mostRecent = first(querySnapshot.docs)

    return mostRecent.data().revisionId
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

