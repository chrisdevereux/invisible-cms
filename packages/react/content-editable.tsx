import React, { createContext, useContext, createElement, Children, useState } from "react";
import ReactEditable from 'react-contenteditable'
import { useContent } from "./content-item";
import { ConfigContext } from "./config";

const EditContext = createContext(undefined)

export const Editable = ({ id, initialValue, children, editable = true, contentMapper = defaultMapper }) => {
  const content = useContent(id)

  const editContext = content && {
    value: contentMapper.toHtml(content.value) || initialValue,
    onChange: event => content.onChange(
      contentMapper.fromHtml(event.currentTarget.innerHTML || '')
    )
  }

  return (
    <EditContext.Provider value={editable ? editContext : undefined}>
      {children}
    </EditContext.Provider>
  )
}

export const Content = ({ tagName = 'div', ...props }) => {
  const { editable } = useContext(ConfigContext)
  const editContext = useContext(EditContext)

  if (!editContext) {
    return createElement(tagName, props)
  }

  if (!editable) {
    const innerHtml = { __html: editContext.value }
    return createElement(tagName, { ...props, dangerouslySetInnerHTML: innerHtml })
  }

  return (
    <ReactEditable
      {...props}
      tagName={tagName}
      html={editContext.value}
      onChange={editContext.onChange}
    />
  )
}

const defaultMapper = {
  toHtml: string => string,
  fromHtml: html => html
}
