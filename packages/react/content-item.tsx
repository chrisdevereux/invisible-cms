import React from "react"
import produce from 'immer'
import { ContentMapper, useContent, ProvideContent, placeholderContent } from "./content"

export const ContentItem = ({ id, type, label = id, children, contentMapper = ContentMapper.identity }) => {
  const parent = useContent<any>()
  const parentValue = parent.value || {}
  const onChange = change => parent.onChange(
    produce(parentValue , draft => {
      draft[id] = contentMapper.reverseMap(change)
     })
  )

  return (
    <ProvideContent
      {...parent}
      label={label}
      value={contentMapper.map(parentValue[id] || placeholderContent(type))}
      onChange={onChange}
    >
      {children}
    </ProvideContent>
  )
}

export const ContentArray = ({ children, keyBy = indexKey }) => {
  const parent = useContent<any[]>()
  const onChange = (i, change) => parent.onChange(
    produce(parent.value, draft => {
      draft[i] = change
    })
  )

  return (
    <>
      {parent.value.map((child, i) => (
        <ProvideContent
          {...parent}
          key={keyBy(child, i)}
          value={child}
          label={String(i)}
          onChange={x => onChange(i, x)}
        >
          {children()}
        </ProvideContent>
      ))}
    </>
  )
}

const indexKey = (_, i) => i
