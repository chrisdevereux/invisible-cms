import { CmsBackend, CmsRevision } from "@invisiblecms/core";
import { firestore } from 'firebase-admin'

export class FirebaseCmsBackend implements CmsBackend {
  db = firestore()

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
    const querySnapshot = await this.db.collection('publish').orderBy('timestamp').limit(1).get()
    const mostRecent = first(querySnapshot.docs)

    return mostRecent.data().revisionId
  }
}

const first = <T>(x: T[] | null) => x && x[0]
