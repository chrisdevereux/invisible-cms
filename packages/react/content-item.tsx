import { createContext, useContext } from "react";
import { useCollectionValue, Collection } from './collection'
import { CmsRevisionProps } from "@invisiblecms/core";

export const ContentItemContext = createContext(undefined)

export class ContentItem {
  collection = new Collection()

  static fromRevision(revision: CmsRevisionProps) {
    return new ContentItem(revision.content)
  }

  static fromValue(val: any) {
    if (val && val.constructor === Object) {
      return new ContentItem(val)

    } else if (Array.isArray(val)) {
      return val.map(ContentItem.fromValue)

    } else {
      return val
    }
  }

  constructor(content = {}) {
    for (const [key, val] of Object.entries(content)) {
      this.collection.set(key, ContentItem.fromValue(val))
    }
  }

  toRevision(): CmsRevisionProps {
    return {
      content: this.toJSON()
    }
  }

  toJSON() {
    return this.collection.toJson()
  }
}

export const useContent = (id) => {
  const contentItem = useContext(ContentItemContext)
  const value = useCollectionValue(contentItem.collection, id)

  return {
    value,
    onChange: x => contentItem.collection.set(id, x)
  }
}
