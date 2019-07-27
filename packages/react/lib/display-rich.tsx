import  React, { createElement, lazy } from "react";
import ReactEditable from 'react-contenteditable'
import createPurify from 'dompurify'
import { useContent } from "./content";

const purify = createPurify()

export const DisplayRichText = ({ tagName = 'div', ...props }) => {
  const content = useContent<string>()
  const html = {
    __html: purify.sanitize(content.value)
  }

  if (!content.editable) {
    return createElement(tagName, { ...props, dangerouslySetInnerHTML: html })
  }

  return (
    <ReactEditable
      {...props}
      tagName={tagName}
      html={html.__html}
      onChange={event => content.onChange(event.currentTarget.innerHTML)}
    />
  )
}
