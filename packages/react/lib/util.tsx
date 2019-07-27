import React, { useState, FC } from "react";

export const noop = () => {}

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
