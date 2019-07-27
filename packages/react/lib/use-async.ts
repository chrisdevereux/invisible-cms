import { useState, useEffect, Fragment } from "react";

export const useAsync = <T>(fn: () => Promise<T>, deps: unknown[]) => {
  const [state, setState] = useState<{ value: T }>()

  useEffect(() => {
    const resolve = async () => {
      setState({ value: await fn() })
    }
    resolve()

  }, deps)

  return state
}
