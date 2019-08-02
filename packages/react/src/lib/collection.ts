import { useState, useEffect } from "react";

export interface CollectionItem {
  toJson?(): Object
}

type CollectionObserver<T> = (x: T) => void

export class Collection<T extends CollectionItem> {
  content = new Map<string, T>()
  observers = new Set<CollectionObserver<T>>()

  get(id: string) {
    return this.content.get(id)
  }

  set(id: string, value: T) {
    return this.content.set(id, value)
  }

  [Symbol.iterator]() {
    return this.content[Symbol.iterator]()
  }

  toJson() {
    const plain = {}

    for (const [key, val] of this) {
      plain[key] = val.toJson ? val.toJson() : val
    }

    return plain
  }

  observe(id: string, cb: CollectionObserver<T>) {
    const observer = () => {
      cb(this.get(id))
    }

    this.observers.add(observer)

    return () => {
      this.observers.delete(observer)
    }
  }
}

export const useCollectionValue = <T extends CollectionItem>(item: Collection<T>, id: string) => {
  const [state, setState] = useState(item.get(id))
  useEffect(() => item.observe(id, setState), [item])

  return state
}
