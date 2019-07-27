import React, { ReactNode, ReactElement } from "react"
import produce from 'immer'
import { ContentMapper, useContent, ProvideContent, placeholderContent, ContentType } from "./content"
import { EditUiButton, EditUiControls, HoverOver } from "./ui/atoms";
import { ContentTypePicker } from "./ui/content-type-picker";

interface ContentItemProps {
  type?: ContentType
  dataRef?: string
  label?: string
  children?: ReactElement
  contentMapper?: ContentMapper
  className?: string
}

export const ContentItem = ({ className, dataRef, type, label = type && type.name, children, contentMapper = ContentMapper.identity }: ContentItemProps) => {
  const parent = useContent<any>()

  const parentValue = parent.value || {}
  const onChange = change => {
    if (dataRef) {
      parent.onChange(
        produce(parentValue, draft => {
          draft[dataRef] = contentMapper.reverseMap(change)
         })
      )
    } else {
      parent.onChange(change)
    }
  }

  const { onRemove, availableTypes } = parent
  const value = dataRef ? parentValue[dataRef] : parentValue

  return (
    <div className={className} style={{ position: 'relative' }}>
      <ProvideContent
        {...parent}
        label={label}
        value={contentMapper.map(value || type && placeholderContent(type))}
        onChange={onChange}
      >
        {children}
        {(onRemove || availableTypes) && (
          <HoverOver>
            <EditUiControls>
              {availableTypes && <ContentTypePicker availableTypes={availableTypes} value={value} onChange={onChange} />}
              {onRemove && <EditUiButton onClick={() => onRemove()}>–</EditUiButton>}
            </EditUiControls>
          </HoverOver>
        )
      }
      </ProvideContent>
    </div>
  )
}

interface ContentIteratorProps {
  dataRef?: string
  children?: ReactNode
  keyBy?: (x: any, i: number) => string
}

export const ContentIterator = ({ dataRef, children, keyBy = indexKey }: ContentIteratorProps) => {
  const parent = useContent<any[]>()

  if (dataRef) {
    return (
      <ContentItem dataRef={dataRef}>
        <ContentIterator keyBy={keyBy}>
          {children}
        </ContentIterator>
      </ContentItem>
    )
  }

  const parentValue = Array.isArray(parent.value) ? parent.value : []

  const onChange = (i, change) => parent.onChange(
    produce(parentValue, draft => {
      draft[i] = change
    })
  )

  const onAdd = () => {
    parent.onChange([
      ...parentValue,
      undefined
    ])
  }

  return (
    <>
      {parentValue.map((child, i) => (
        <ProvideContent
          {...parent}
          key={keyBy(child, i)}
          onRemove={() => {
            parent.onChange(
              produce(parent.value, draft => {
                draft.splice(i, 1)
              })
            )
          }}
          value={child}
          label={String(i)}
          onChange={x => onChange(i, x)}
        >
          {children}

        </ProvideContent>
      ))}
      <EditUiButton onClick={onAdd}>Add</EditUiButton>
    </>
  )
}

interface ContentSwitchProps {
  children: Array<ReactElement<ContentItemProps>>
  dataRef?: string
}

export const ContentSwitch = ({ children, dataRef }: ContentSwitchProps) => {
  const content = useContent()

  if (dataRef) {
    return (
      <ContentItem dataRef={dataRef}>
        <ContentSwitch>
          {children}
        </ContentSwitch>
      </ContentItem>
    )
  }

  const hit = children.find(child => child.props.type.validator(content.value)) || children[0]

  return (
    <ProvideContent {...content} value={content.value || hit.props.type && placeholderContent(hit.props.type)} availableTypes={children.map(child => child.props.type)}>
      {hit}
    </ProvideContent>
  )
}

const indexKey = (_, i) => i
