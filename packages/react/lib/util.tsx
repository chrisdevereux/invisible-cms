import React, { useState, FC, useCallback } from "react";
import { debounce } from "lodash";

export const noop = () => {}

export function useDebounce<T extends (...args: any) => void>(ms: number, fn: T, deps: unknown[]): T {
  return useCallback(debounce(fn, ms), deps)
}

interface StateContainerProps<T> {
  initial: T
  children: FC<StateProps<T>>
}

export function StateContainer<T>({ children, initial }: StateContainerProps<T>) {
  const [value, onChange] = useState(initial)
  console.log('state:', value)

  return children({ value, onChange })
}

interface StateProps<T> {
  value: T
  onChange: (x: T) => void
}

export function withState<T>(initial: T, fn: FC<StateProps<T>>) {
  return () => (
    <StateContainer initial={initial}>
      {fn}
    </StateContainer>
  )
}
